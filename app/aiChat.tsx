import React, { useEffect, useRef, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ChevronLeft, User, Send } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import TypingIndicator from "@/assets/components/TypingIndicator";
const Icon = require("@/assets/images/chatIcon.png");

const WS_URL = "ws://172.20.10.2:8000/ws/test123";

type ActionDetails = {
  type: "call" | "email" | "book";
  label: string;
  data: any;
};

type Message = {
  type: string;
  text: string;
  timestamp: string;
  action_details?: ActionDetails | null;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const ws = useRef<WebSocket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [typing, setTyping] = useState(false);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const handleAction = (action: ActionDetails) => {
    switch (action.type) {
      case "call":
        Linking.openURL(`tel:${action.data}`);
        break;
      case "email":
        Linking.openURL(
          `mailto:${action.data.email}?subject=${encodeURIComponent(
            action.data.subject || ""
          )}&body=${encodeURIComponent(action.data.body || "")}`
        );
        break;
      case "book":
        // navigate to booking screen
        // navigation.navigate("BookingScreen");
        break;
      default:
        console.warn("Unknown action type:", action.type);
    }
  };

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "start" || data.partial) {
          setTyping(true);
          return;
        }

        if (data.answer) {
          setTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              type: "system",
              text: data.answer,
              action_details: data.action_details || null,
              timestamp:
                new Date().getHours().toString().padStart(2, "0") +
                ":" +
                new Date().getMinutes().toString().padStart(2, "0"),
            },
          ]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      setStatus("connected");
    };

    socket.onclose = () => setStatus("disconnected");
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setStatus("disconnected");
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(input.trim());

      setMessages((prev) => [
        ...prev,
        {
          type: "client",
          text: input.trim(),
          timestamp:
            new Date().getHours().toString().padStart(2, "0") +
            ":" +
            new Date().getMinutes().toString().padStart(2, "0"),
        },
      ]);

      setTyping(true);

      setInput("");
    } else {
      console.warn("⚠️ WebSocket is not connected");
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const statusColor =
    status === "connected"
      ? "#22C55E"
      : status === "connecting"
      ? "#FACC15"
      : "#EF4444";
  const statusText =
    status === "connected"
      ? "Connected"
      : status === "connecting"
      ? "Connecting..."
      : "Disconnected";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#efefefff" />
        </TouchableOpacity>
        <Image source={Icon} style={styles.headerAvatar} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>Dr. Navariyan AI</Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <User size={24} color="#f1f1f1ff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {messages.map((msg, idx) => {
            const isSystemMessage = msg.type === "system";
            return (
              <React.Fragment key={idx}>
                <View
                  style={[
                    styles.messageRow,
                    isSystemMessage
                      ? styles.messageRowLeft
                      : styles.messageRowRight,
                  ]}
                >
                  {isSystemMessage && (
                    <Image source={Icon} style={styles.messageAvatar} />
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      isSystemMessage
                        ? styles.systemBubble
                        : styles.clientBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.text}</Text>
                    <Text style={styles.timestamp}>{msg.timestamp}</Text>
                  </View>
                </View>

                {/* Action button */}
                {isSystemMessage && msg.action_details && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(msg.action_details!)}
                  >
                    <Text style={styles.actionButtonText}>
                      {msg.action_details.label}
                    </Text>
                  </TouchableOpacity>
                )}
              </React.Fragment>
            );
          })}

          {typing && <TypingIndicator />}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Type your message here.."
              placeholderTextColor="#999"
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={22} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#24786D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#24786D",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 8 },
  headerTextContainer: { flex: 1, marginLeft: 12 },
  headerName: { fontWeight: "bold", fontSize: 16, color: "#ffffffff" },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 14, color: "#e5e5e5ff" },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5ff",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 25,
  },
  messageRowLeft: { justifyContent: "flex-start" },
  messageRowRight: { justifyContent: "flex-end" },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: { maxWidth: "80%", borderRadius: 8, padding: 12 },
  clientBubble: { backgroundColor: "#D1FAE5", borderBottomRightRadius: 0 },
  systemBubble: { backgroundColor: "#FFFFFF", borderBottomLeftRadius: 0 },
  messageText: { fontSize: 16, color: "#000000" },
  timestamp: {
    fontSize: 12,
    color: "#6B7283",
    textAlign: "right",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#24786D",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    height: 40,
    marginLeft: 12,
    fontSize: 16,
    color: "#000000",
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: "#059669",
    padding: 12,
    borderRadius: 999,
  },

  actionButton: {
    backgroundColor: "#059669",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 40,
    alignSelf: "flex-start",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ChatScreen;

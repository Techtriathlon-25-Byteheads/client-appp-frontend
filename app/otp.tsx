// app/otp.tsx
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api, ApiError } from "@/services/api";

const heroImage = require("@/assets/images/otpBg.png");
const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Lang = "si" | "ta" | "en";
const T: Record<Lang, any> = {
  en: {
    title: (p: string) => `Enter the OTP sent to ${p}`,
    subtitle: "We've sent a 6-digit verification code",
    didnt: "Didn't receive the code?",
    resend: "Resend Code",
    cta: "Verify & Continue",
    enterCode: "Enter verification code",
  },
  si: {
    title: (p: string) => `${p} වෙත එවූ OTP යොදන්න`,
    subtitle: "අංක 6කින් යුත් සත්‍යාපන කේතයක් යවා ඇත",
    didnt: "කේතය ලැබුණේ නැද්ද?",
    resend: "නැවත යවන්න",
    cta: "සත්‍යාපනය කර ඉදිරියට",
    enterCode: "සත්‍යාපන කේතය ඇතුළත් කරන්න",
  },
  ta: {
    title: (p: string) => `${p} க்கு அனுப்பிய OTP ஐ உள்ளிடவும்`,
    subtitle: "6 இலக்க சரிபார்ப்பு குறியீட்டை அனுப்பியுள்ளோம்",
    didnt: "குறியீடு கிடைக்கவில்லையா?",
    resend: "மீண்டும் அனுப்பு",
    cta: "சரிபார்த்து தொடர்க",
    enterCode: "சரிபார்ப்பு குறியீட்டை உள்ளிடவும்",
  },
};

const maskSriLankaPhone = (raw: string) => {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  const first = local.slice(0, 1);
  const last2 = local.slice(-2);
  return `+94 ${first}*****${last2}`;
};

export default function OTP() {
  const {
    phone = "",
    userId = "",
    lang = "en",
  } = useLocalSearchParams<{ phone?: string; userId?: string; lang?: Lang }>();
  const L: Lang = (["si", "ta", "en"] as const).includes(lang as Lang)
    ? (lang as Lang)
    : "en";
  const insets = useSafeAreaInsets();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const inputs = useRef<Array<TextInput | null>>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setTimeout(() => inputs.current[0]?.focus(), 300);
  }, []);

  useEffect(() => {
    setSeconds(30);
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const focusIndex = (i: number) => {
    inputs.current[i]?.focus();
    setFocusedIndex(i);
  };

  const handleChange = (index: number, value: string) => {
    const char = (value.match(/\d/g) || []).pop() || "";
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");

    if (char && index < 5) focusIndex(index + 1);
  };

  const handleKey = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
        return;
      }
      if (index > 0) {
        focusIndex(index - 1);
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    }
  };

  const handleFocus = (index: number) => setFocusedIndex(index);
  const handleBlur = () => setFocusedIndex(-1);

  const onResend = async () => {
    if (seconds > 0) return;
    try {
      setIsLoading(true);
      setError("");
      await api.login(userId, phone);
      setSeconds(30);
    } catch {
      setError("Failed to resend OTP. Please try again.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      triggerShake();
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await api.verifyOTP(userId, code);
      router.replace("/");
    } catch (error) {
      if (error instanceof ApiError) setError(error.message);
      else setError("Failed to verify OTP. Please try again.");

      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const code = digits.join("");
  const masked = maskSriLankaPhone(String(phone));
  const isComplete = code.length === 6;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" translucent />

      {/* Full-screen background */}
      <Image
        source={heroImage}
        style={{
          ...StyleSheet.absoluteFillObject,
          width: SCREEN_WIDTH,
          height: "100%",
        }}
        resizeMode="cover"
      />

      <Animated.View
        style={{
          flex: 1,
          marginTop: 400,
          paddingHorizontal: 24,
          paddingTop: 32,
          backgroundColor: "#fff",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          opacity: fadeAnimation,
          transform: [{ translateX: shakeAnimation }],
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text
            style={{ fontSize: 22, fontWeight: "800", textAlign: "center" }}
          >
            {T[L].title(masked)}
          </Text>
          <Text style={{ fontSize: 16, textAlign: "center", color: "#64748B" }}>
            {T[L].subtitle}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          {digits.map((d, i) => (
            <View key={i} style={{ position: "relative" }}>
              <TextInput
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={d}
                onChangeText={(val) => handleChange(i, val)}
                onKeyPress={(e) => handleKey(i, e)}
                onFocus={() => handleFocus(i)}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={1}
                returnKeyType={i === 5 ? "done" : "next"}
                style={{
                  width: 52,
                  height: 64,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: "#E2E8F0",
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "700",
                }}
              />
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: "#94A3B8", fontSize: 15 }}>{T[L].didnt}</Text>
          <Pressable
            onPress={onResend}
            disabled={seconds > 0 || isLoading}
            style={{ padding: 4 }}
          >
            <Text style={{ color: "#059669", fontWeight: "700" }}>
              {T[L].resend}
              {seconds > 0 ? ` (${seconds}s)` : ""}
            </Text>
          </Pressable>
        </View>

        {error ? (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#DC2626",
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {error}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={{
            backgroundColor: isComplete ? "#059669" : "#E2E8F0",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            width: "100%",
            opacity: isLoading || !isComplete ? 0.6 : 1,
          }}
          disabled={isLoading || !isComplete}
          onPress={verifyOTP}
        >
          <Text
            style={{
              color: isComplete ? "#fff" : "#64748B",
              fontSize: 17,
              fontWeight: "700",
            }}
          >
            {isLoading ? "Verifying..." : T[L].cta}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

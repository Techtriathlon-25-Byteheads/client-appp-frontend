import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  Inter_100Thin_Italic,
  Inter_200ExtraLight_Italic,
  Inter_300Light_Italic,
  Inter_400Regular_Italic,
  Inter_500Medium_Italic,
  Inter_600SemiBold_Italic,
  Inter_700Bold_Italic,
  Inter_800ExtraBold_Italic,
  Inter_900Black_Italic,
} from "@expo-google-fonts/inter";

import AppointmentSlider from "@/assets/components/appointmentScroll";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ChatbotBanner = require("@/assets/images/chatbotBanner.png");

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Inter_100Thin_Italic,
    Inter_200ExtraLight_Italic,
    Inter_300Light_Italic,
    Inter_400Regular_Italic,
    Inter_500Medium_Italic,
    Inter_600SemiBold_Italic,
    Inter_700Bold_Italic,
    Inter_800ExtraBold_Italic,
    Inter_900Black_Italic,
    FMEmanee: require("@/assets/fonts/FMEmanee.ttf"),
  });

  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed green background */}
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Ayubowan, Yasiru!</Text>
          <Text style={styles.greetingSmall}>whqfndajka" hisreæ</Text>
          <Text style={styles.greetingSmall}>வணக்கம்" யசிருæ</Text>
        </View>
        <Ionicons name="person-circle-outline" size={50} color="#fff" />
      </View>
      <View style={styles.subContent}>
        <Text style={styles.subtitle}>
          Welcome to Goverse Government Services Portal
        </Text>
      </View>

      {/* White scrollable content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.scrollArea}
      >
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={'Search for a Service, Try "Driver\'s License"'}
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#999"
          />

          <TouchableOpacity>
            <MaterialIcons
              name="mic"
              size={24}
              color="#666"
              style={styles.mic}
            />
          </TouchableOpacity>
        </View>
        {/* Popular Services */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <View style={styles.serviceGrid}>
          {[
            "National Identity Card Services",
            "Driving License Renewals",
            "Tax Declaration Submissions",
            "Passport Renewals",
          ].map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceCard}>
              <MaterialIcons
                name="post-add"
                size={24}
                color="#1f6b5c"
                style={{ marginBottom: 5 }}
              />
              <Text style={styles.serviceText}>{service}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All Services →</Text>
        </TouchableOpacity>

        {/* Ongoing Appointments */}
        <Text style={styles.sectionTitle}>Ongoing Appointments</Text>
        <AppointmentSlider />

        {/* Health Check */}
        <Image
          source={ChatbotBanner}
          style={{
            width: SCREEN_WIDTH - 32,
            alignSelf: "center",
            resizeMode: "contain",
            borderRadius: 12,
          }}
        />
      </ScrollView>

      {/* Floating Icon */}
      <TouchableOpacity style={styles.floatingIcon}>
        <FontAwesome5 name="user-md" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#1f6b5c", paddingHorizontal: 20 },

  headerContent: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
  },

  subContent: {
    marginTop: -15,
    paddingHorizontal: 20,
  },
  greeting: {
    width: "100%",
    fontFamily: "Inter_500Medium",
    color: "#fff",
    fontSize: 25,
    fontWeight: "500",
  },
  greetingSmall: {
    fontFamily: "FMEmanee",
    color: "#fff",
    fontSize: 20,
    lineHeight: 25,
  },
  subtitle: {
    color: "#d9f0eb",
    fontSize: 14,
    marginTop: 8,
  },

  scrollArea: {
    marginTop: 20, // push content below header
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebebff",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    margin: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, // for Android shadow
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  mic: {
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 24,
    fontFamily: "Inter_500Medium",
    marginHorizontal: 16,
    marginTop: 16,
    color: "#1f6b5c",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  serviceCard: {
    backgroundColor: "#e8f4f1",
    width: "48%",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
  },
  serviceText: {
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    color: "#000000ff",
    fontSize: 15,
  },
  seeAllButton: {
    backgroundColor: "#1f6b5c",
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    marginBottom: 5,
  },
  seeAllText: {
    fontFamily: "Inter_500Medium",
    color: "#fff",
    fontSize: 15,
  },
  appointmentCard: {
    backgroundColor: "#1f6b5c",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  appointmentTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  appointmentSub: { color: "#d9f0eb", fontSize: 13, marginBottom: 8 },
  appointmentDetails: { marginTop: 10 },
  detailItem: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  detailText: { color: "#fff", fontSize: 12, marginLeft: 6 },
  healthCard: {
    backgroundColor: "#e0f5f2",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthTitle: { fontSize: 16, fontWeight: "bold", color: "#1f6b5c" },
  healthButton: {
    backgroundColor: "#1f6b5c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  healthButtonText: { color: "#fff", fontSize: 12 },
  floatingIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1f6b5c",
    borderRadius: 30,
    padding: 12,
    elevation: 3,
  },
});

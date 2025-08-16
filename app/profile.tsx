import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ongoingAppointments = [
  {
    id: "1",
    type: "General Checkup",
    date: "Aug 20, 2025",
    time: "10:00 AM",
    location: "HealthHub Clinic",
  },
  {
    id: "2",
    type: "Dental Cleaning",
    date: "Sep 2, 2025",
    time: "2:30 PM",
    location: "SmileCare Center",
  },
];

const translations = {
  en: {
    profile: "Profile",
    fullName: "Full Name",
    city: "City",
    phone: "Phone Number",
    nic: "NIC Number",
    createAppointment: "Create New Appointment",
    preferredLanguage: "Preferred Language",
    logout: "Log Out",
    logoutTitle: "Log Out",
    logoutMessage: "Are you sure you want to log out?",
    cancel: "Cancel",
    version: "GovQ V1.2",
  },
  si: {
    profile: "පැතිකඩ",
    fullName: "සම්පූර්ණ නම",
    city: "නගරය",
    phone: "දුරකථන අංකය",
    nic: "ජා.හැ.අංකය",
    createAppointment: "නව වෙන්කිරීමක් සාදන්න",
    preferredLanguage: "කැමති භාෂාව",
    logout: "පිටවීම",
    logoutTitle: "පිටවීම",
    logoutMessage: "ඔබට පිටවීමට අවශ්‍යද?",
    cancel: "අවලංගු කරන්න",
    version: "GovQ V1.2",
  },
  ta: {
    profile: "சுயவிவரம்",
    fullName: "முழு பெயர்",
    city: "நகரம்",
    phone: "தொலைபேசி எண்",
    nic: "தேசிய அடையாள எண்",
    createAppointment: "புதிய நேரத்தை உருவாக்கவும்",
    preferredLanguage: "விருப்பமான மொழி",
    logout: "வெளியேறு",
    logoutTitle: "வெளியேறு",
    logoutMessage: "நீங்கள் வெளியேற விரும்புகிறீர்களா?",
    cancel: "ரத்து செய்",
    version: "GovQ V1.2",
  },
};

type Language = 'en' | 'si' | 'ta';
const languages: Language[] = ['si', 'ta', 'en'];

export default function ProfileSection() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedLang, setSelectedLang] = useState<Language>("en");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const t = translations[selectedLang];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileIconWrapper}>
            <Feather name="user" size={54} color={BRAND_GREEN} />
          </View>
          <Text style={styles.profileName}>John Doe</Text>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>{t.fullName}</Text>
            <Text style={styles.userInfoValue}>John Doe</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>{t.city}</Text>
            <Text style={styles.userInfoValue}>Colombo</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>{t.phone}</Text>
            <Text style={styles.userInfoValue}>+94 77 123 4567</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>{t.nic}</Text>
            <Text style={styles.userInfoValue}>199012345678</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newAppointmentButton}
          onPress={() => router.push("/bookAppointment")}
        >
          <Feather
            name="plus"
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.newAppointmentButtonText}>
            {t.createAppointment}
          </Text>
        </TouchableOpacity>

        {/* Render ongoing appointments */}
        <View style={{ marginVertical: 24 }}>
          {ongoingAppointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              <View style={styles.appointmentIconCircle}>
                <Feather name="calendar" size={18} color="#fff" />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentType}>{app.type}</Text>
                <Text style={styles.appointmentDetails}>
                  {app.date} | {app.time}
                </Text>
                <Text style={styles.appointmentLocation}>{app.location}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.langLabel}>{t.preferredLanguage}</Text>
          <View style={styles.langSelector}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langButton,
                  selectedLang === lang && styles.langButtonActive,
                ]}
                onPress={() => setSelectedLang(lang)}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    selectedLang === lang && styles.langButtonTextActive,
                  ]}
                >
                  {lang === "si" ? "සිං" : lang === "ta" ? "தமிழ்" : "En"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={styles.logoutButtonText}>{t.logout}</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>{t.version}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.logoutTitle}</Text>
            <Text style={styles.modalMessage}>{t.logoutMessage}</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>{t.cancel}</Text>
              </Pressable>
              <Pressable
                style={styles.modalLogout}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalLogoutText}>{t.logout}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const BRAND_GREEN = "#4A934A";
const SURFACE = "#fff";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#666";
const BORDER = '#e0e0e0';

const styles = StyleSheet.create({
  // --- NEW STYLES for the header layout ---
  container: {
    flex: 1,
    backgroundColor: BRAND_GREEN, // Main background is now green
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4, // Increases touchable area for the back arrow
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  sheet: {
    flex: 1,
    backgroundColor: SURFACE, // The scrollable area is a white "sheet"
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 32, // Added more padding at the bottom
  },
  // --- END NEW STYLES ---

  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f2f8f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: BRAND_GREEN,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 14,
  },
  appointmentsList: {
    marginBottom: 32,
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fdfb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  appointmentIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BRAND_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  appointmentDetails: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 1,
  },
  appointmentLocation: {
    fontSize: 13,
    color: BRAND_GREEN,
    fontWeight: "500",
  },
  newAppointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BRAND_GREEN,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  newAppointmentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  userInfoSection: {
    marginBottom: 32,
    backgroundColor: "#F8FAFB",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 10,
  },
  userInfoLabel: {
    fontSize: 15,
    color: "#888",
    fontWeight: "500",
    flex: 1,
  },
  userInfoValue: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: "600",
    flex: 1.2,
    textAlign: "right",
  },
  bottomSection: {
    alignItems: "center",
    paddingTop: 32, // Increased top padding for better spacing
    backgroundColor: SURFACE,
    borderTopWidth: 0,
  },
  langLabel: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 10,
    fontWeight: "400",
  },
  langSelector: {
    flexDirection: "row",
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    justifyContent: "center",
  },
  langButton: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "transparent",
    marginHorizontal: 2,
  },
  langButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  langButtonText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "500",
  },
  langButtonTextActive: {
    color: "#222",
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#FF5A5F",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 8,
    marginTop: 2,
    alignItems: "center",
    alignSelf: "center",
    minWidth: 180,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  versionText: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 12, // Added margin for spacing
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    marginBottom: 22,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancel: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "600",
  },
  modalLogout: {
    flex: 1,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalLogoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
});

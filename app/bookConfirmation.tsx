import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Color Palette ---
const BRAND_GREEN = '#4A934A';
const SURFACE = '#FFFFFF';
const TEXT_PRIMARY = '#1E1E1E';
const TEXT_SECONDARY = '#6A6A6A';
const LIGHT_GRAY = '#F2F2F2';
const ACCENT_LIGHT_GREEN = '#E6F4EA';
const BORDER_COLOR = '#E6E6E6';

export default function BookingConfirmation() {
  // --- Hooks for navigation and parameters ---
  const router = useRouter();
  const { serviceName, date, time, phone } = useLocalSearchParams();

  const formattedTime = useMemo(() => {
    if (!time || typeof time !== 'string') {
      return '11:00'; // Default or fallback time
    }
    try {
      const dateObj = new Date(time);
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return time; // Return original string if invalid
      }
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error("Failed to parse time:", error);
      return time; // Return original string on error
    }
  }, [time]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Green Header Section:
        Contains the back button and profile icon.
      */}
      <View style={styles.greenHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={SURFACE} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Feather name="user" size={24} color={SURFACE} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* White Content Area:
        This section holds the main confirmation details.
      */}
      <View style={styles.whiteContent}>
        <Text style={styles.mainTitle}>Booking Confirmation</Text>

        {/* Confirmation Card */}
        <View style={styles.confirmCard}>
          {/* Floating Checkmark Icon */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="check" size={36} color={BRAND_GREEN} />
          </View>

          {/* Confirmation Text */}
          <Text style={styles.confirmTitle}>You have successfully made an appointment</Text>
          <Text style={styles.confirmSubtitle}>Your documents are under review.</Text>
          <Text style={styles.confirmInfo}>
            Your appointment confirmation will be sent to <Text style={styles.bold}>{phone || '0763951245'}</Text> via SMS.
          </Text>

          {/* Appointment Details Box */}
          <View style={styles.appointmentInfo}>
            <MaterialCommunityIcons name="calendar" size={20} color={BRAND_GREEN} />
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentType}>{serviceName || "New Driver's License Appointment"}</Text>
              <Text style={styles.appointmentDate}>{date || 'Wednesday, 10 Jan 2026'}, {formattedTime}</Text>
            </View>
          </View>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BRAND_GREEN 
  },
  greenHeader: { 
    backgroundColor: BRAND_GREEN, 
    paddingTop: 50, // Added more padding for status bar area
    paddingBottom: 20, 
    paddingHorizontal: 16 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backButtonText: { 
    color: SURFACE, 
    fontSize: 16, 
    marginLeft: 8 
  },
  profileButton: {},
  profileIcon: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 20, 
    padding: 8 
  },
  whiteContent: { 
    flex: 1, 
    backgroundColor: SURFACE, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    marginTop: -20, // Overlaps the green header for the curved effect
    paddingHorizontal: 20, 
    alignItems: 'center' 
  },
  mainTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: TEXT_PRIMARY, 
    marginBottom: 24, 
    marginTop: 24, 
    alignSelf: 'flex-start', // Aligns title to the left
    marginLeft: 4 
  },
  confirmCard: {
    backgroundColor: SURFACE,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 32,
    width: '100%',
    marginTop: 16,
  },
  iconCircle: {
    backgroundColor: ACCENT_LIGHT_GREEN,
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50, // Pulls the icon up to float over the card
    marginBottom: 16,
    borderWidth: 4,
    borderColor: SURFACE,
  },
  confirmTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: TEXT_PRIMARY, 
    textAlign: 'center', 
    marginBottom: 8 
  },
  confirmSubtitle: { 
    fontSize: 14, 
    color: TEXT_SECONDARY, 
    textAlign: 'center', 
    marginBottom: 12 
  },
  confirmInfo: { 
    fontSize: 14, 
    color: TEXT_SECONDARY, 
    textAlign: 'center', 
    marginBottom: 20,
    paddingHorizontal: 10 // Prevents text from touching edges
  },
  bold: { 
    fontWeight: 'bold', 
    color: TEXT_PRIMARY 
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    width: '100%',
  },
  appointmentDetails: { 
    marginLeft: 10 
  },
  appointmentType: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: TEXT_PRIMARY 
  },
  appointmentDate: { 
    fontSize: 14, 
    color: TEXT_SECONDARY 
  },
  homeButton: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto', // Pushes the button to the bottom
    marginBottom: 30, // Adds some space from the bottom edge
    width: '100%',
  },
  homeButtonText: { 
    color: SURFACE, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
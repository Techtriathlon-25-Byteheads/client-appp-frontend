import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, } from 'expo-router'; // <-- Import Link and useRouter
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// A placeholder for the doctor illustration
const doctorIllustration = require('../assets/images/doctor-illustration.png');

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#4A934A" />

      {/* --- Fixed Green Background --- */}
      <View style={styles.greenBackground}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ayubowan, yasiru!</Text>
            <Text style={styles.greetingSub}>ආයුබෝවන්, යසිරු!</Text>
            <Text style={styles.greetingSub}>வணக்கம், யசிரு!</Text>
            <Text style={styles.welcomeText}>Welcome to National Health Hub of Sri Lanka.</Text>
          </View>
          <Link href="/login" asChild>
          <TouchableOpacity style={styles.profileIconContainer}>
            <Feather name="user" size={28} color="#4A934A" />
          </TouchableOpacity>
        </Link>
        </View>
      </View>

      <ScrollView
        style={styles.whiteSheet}
        contentContainerStyle={styles.whiteSheetContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>What Medi-Help do you need Today?</Text>

        {/* --- Action Cards --- */}
        <View style={styles.cardRow}>
          {/* --- Updated this card --- */}
          <Link href="/book-appointment" asChild>
            <TouchableOpacity style={styles.card}>
              <FontAwesome name="calendar-plus-o" size={24} color="#4A934A" />
              <Text style={styles.cardTitle}>Book an Apppointment</Text>
              <Text style={styles.cardSubtitle}>Book a Doctor or scan</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.card}>
            <FontAwesome name="file-text-o" size={24} color="#4A934A" />
            <Text style={styles.cardTitle}>My Reports</Text>
            <Text style={styles.cardSubtitle}>Your Previous Medical Documents</Text>
          </TouchableOpacity>
        </View>

        {/* --- General Appointment Card --- */}
  <Link href="/appointments" asChild>
  <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.8}>
    <View style={styles.appointmentHeader}>
      <View style={styles.appointmentInfo}>
        <View style={styles.calendarIconBg}>
          <FontAwesome name="calendar" size={18} color="#5D9C9C" />
        </View>
        <View>
          <Text style={styles.appointmentTitle}>General Appointment</Text>
          <Text style={styles.appointmentSubtitle}>OPD @ Colombo National Hospital</Text>
        </View>
      </View>

      {/* (Optional) keep this as a separate button or remove it since the whole card is pressable */}
      <TouchableOpacity>
        <MaterialCommunityIcons name="arrow-top-right" size={24} color="white" />
      </TouchableOpacity>
    </View>

    <View style={styles.appointmentDetails}>
      <View style={styles.detailItem}>
        <FontAwesome name="calendar" size={14} color="white" />
        <Text style={styles.detailText}>Wed, 10 Jan, 2024</Text>
      </View>
      <View style={styles.detailItem}>
        <FontAwesome name="clock-o" size={14} color="white" />
        <Text style={styles.detailText}>Mornig set: 11:00</Text>
      </View>
    </View>
  </TouchableOpacity>
</Link>


        {/* --- Health Status Card --- */}
        <View style={styles.healthStatusCard}>
          <View style={styles.healthStatusTextContainer}>
            <Text style={styles.healthStatusTitle}>Check Your Health Status</Text>
            <TouchableOpacity style={styles.tryNowButton}>
              <Text style={styles.tryNowButtonText}>Try Navariyan AI Now</Text>
            </TouchableOpacity>
          </View>
          <Image source={doctorIllustration} style={styles.doctorImage} />
        </View>

        {/* --- Heatstroke Alert --- */}
        <View style={styles.alertContainer}>
            <FontAwesome name="warning" size={18} color="#FFA000" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Heatstroke Alert</Text>
              <Text style={styles.alertMessage}>
                Prolonged exposure to high temperatures can cause dehydration, dizziness, and unconsciousness. Stay hydrated...
              </Text>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A934A',
  },
  greenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250, // Adjust height as needed
    backgroundColor: '#4A934A',
    paddingTop: 40, // Adjust for status bar height if not using SafeAreaView
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greetingSub: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 8,
  },
  
  profileIconContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 50,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteSheet: {
    flex: 1,
    marginTop: 220, // Position it below the header part of the green BG
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  whiteSheetContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at the bottom
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  appointmentCard: {
    backgroundColor: '#5D9C9C',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appointmentSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 12,
  },
  healthStatusCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden', // to contain the image properly
  },
  healthStatusTextContainer: {
    flex: 1,
  },
  healthStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  tryNowButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    alignSelf: 'flex-start', // Don't stretch button
  },
  tryNowButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  doctorImage: {
    width: 100,
    height: 120,
    position: 'absolute',
    right: 0,
    bottom: -15, // Positioned slightly outside the card
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
  },
  alertTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#FFA000',
  },
  alertMessage: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
});

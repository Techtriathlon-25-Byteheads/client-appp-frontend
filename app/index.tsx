import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


const DOCTOR_IMAGE_URL = 'https://i.imgur.com/7p4Ff2v.png';

const HealthAppScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Ayubowan, Yasiru!</Text>
            <Text style={styles.headerSubtitle}>ආයුබෝවන්, යසිරු!</Text>
            <Text style={styles.headerSubtitle}>வணக்கம், யசிரு!</Text>
            <Text style={styles.welcomeText}>Welcome to National Health Hub of Sri Lanka.</Text>
          </View>
          <Ionicons name="person-circle" size={48} color="white" />
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          <Text style={styles.mainCardTitle}>What Medi-Help do you need Today?</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="book-plus-outline" size={32} color="#2D8C6E" />
              <View style={styles.actionButtonTextContainer}>
                <Text style={styles.actionButtonTitle}>Book an Apppointment</Text>
                <Text style={styles.actionButtonSubtitle}>Book a Doctor or scan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={32} color="#2D8C6E" />
              <View style={styles.actionButtonTextContainer}>
                <Text style={styles.actionButtonTitle}>My Reports</Text>
                <Text style={styles.actionButtonSubtitle}>Your Previous Medical Documents</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* General Appointment Card */}
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View>
              <Text style={styles.appointmentTitle}>General Appointment</Text>
              <Text style={styles.appointmentSubtitle}>OPD @ Colombo National Hospital</Text>
            </View>
            <Feather name="phone" size={24} color="white" />
          </View>
          <View style={styles.appointmentDetails}>
            <View style={styles.appointmentInfoItem}>
              <Ionicons name="calendar-outline" size={20} color="white" />
              <Text style={styles.appointmentInfoText}>Wed, 10 Jan, 2024</Text>
            </View>
            <View style={styles.appointmentInfoItem}>
              <Ionicons name="time-outline" size={20} color="white" />
              <Text style={styles.appointmentInfoText}>Mornig set: 11:00</Text>
            </View>
          </View>
        </View>

        {/* Health Check Card */}
        <View style={styles.healthCheckCard}>
          <View style={styles.healthCheckTextContainer}>
            <Text style={styles.healthCheckTitle}>Check Your Health Status</Text>
            <TouchableOpacity style={styles.healthCheckButton}>
              <Text style={styles.healthCheckButtonText}>Try Navariyan AI Now</Text>
            </TouchableOpacity>
          </View>
          <Image source={{ uri: DOCTOR_IMAGE_URL }} style={styles.doctorImage} />
        </View>
        
        {/* Heatstroke Alert */}
        <View style={styles.alertCard}>
            <Ionicons name="warning" size={24} color="#D97706" />
            <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>Heatstroke Alert</Text>
                <Text style={styles.alertBody}>
                    Prolonged exposure to high temperatures can cause dehydration, dizziness, and unconsciousness. Stay hydrated.
                </Text>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2D8C6E',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2D8C6E',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  welcomeText: {
    fontSize: 14,
    color: 'white',
    marginTop: 8,
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -60, // Pulls the card up into the header's padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mainCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#F4F6F9',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  actionButtonTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  appointmentCard: {
    backgroundColor: '#4A9D9C',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  appointmentSubtitle: {
    fontSize: 14,
    color: '#E0F2F1',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  appointmentInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentInfoText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 13,
  },
  healthCheckCard: {
    backgroundColor: '#E0F2E9',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  healthCheckTextContainer: {
    flex: 1,
  },
  healthCheckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E4639',
    marginBottom: 15,
  },
  healthCheckButton: {
    backgroundColor: '#2A7E64',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  healthCheckButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  doctorImage: {
    width: 100,
    height: 120,
    resizeMode: 'contain',
    marginRight: -20, // Allows image to bleed out of the card
  },
  alertCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  alertTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B45309',
  },
  alertBody: {
    fontSize: 13,
    color: '#78350F',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default HealthAppScreen;
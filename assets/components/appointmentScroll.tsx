import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from './appointmentCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SPACING = 16; // space between cards

const appointments = [
  { id: '1', title: "General Appointment", location: "OPD @ Colombo National Hospital", date: "Wed, 10 Jan, 2024", time: "Morning set: 11:00", status: "Approved" },
  { id: '2', title: "Cardiology Consultation", location: "Cardiology Ward @ Colombo National Hospital", date: "Fri, 12 Jan, 2024", time: "Afternoon set: 14:30", status: "Pending" },
  { id: '3', title: "Follow-up Appointment", location: "OPD @ Colombo National Hospital", date: "Mon, 15 Jan, 2024", time: "Morning set: 09:00", status: "Approved" }
];

const AppointmentSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const nextSlide = () => scrollToIndex(currentIndex === appointments.length - 1 ? 0 : currentIndex + 1);
  const prevSlide = () => scrollToIndex(currentIndex === 0 ? appointments.length - 1 : currentIndex - 1);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={appointments}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: CARD_SPACING / 2 }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: SCREEN_WIDTH - CARD_SPACING }]}>
            <AppointmentCard appointment={item} />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={prevSlide} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#4b5563" />
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {appointments.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === currentIndex && styles.activeDot]} />
          ))}
        </View>

        <TouchableOpacity onPress={nextSlide} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentSlider;

const styles = StyleSheet.create({
  container: { paddingBlock: 16 },
  card: { borderRadius: 16},
  navigation: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  navButton: { padding: 8 },
  dotsContainer: { flexDirection: 'row', marginHorizontal: 16 },
  dot: { width: 8, height: 8, borderRadius: 6, backgroundColor: '#d1d5db', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#14b8a6' },
  instructions: { textAlign: 'center', marginTop: 16, color: '#6b7280' }
});
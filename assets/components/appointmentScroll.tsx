import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppointmentCard from "./appointmentCard";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SPACING = 16;
const API_URL = "https://tt25.tharusha.dev/api/user/appointments";

type Appointment = {
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  [key: string]: any;
};

const AppointmentSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.warn("No auth token found");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      // Filter ongoing appointments by date/time
      const now = new Date();
      const ongoing = data
        .map((a: Appointment) => ({
          ...a,
          status:
            a.status === "scheduled"
              ? "Pending"
              : a.status === "completed"
              ? "Completed"
              : "Rejected",
        }))
        .filter((a: Appointment) => {
          const appointmentDate = new Date(
            a.appointmentDate + "T" + a.appointmentTime.slice(11)
          );
          return appointmentDate >= now; // future or ongoing
        });

      setAppointments(ongoing);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const nextSlide = () =>
    scrollToIndex(
      currentIndex === appointments.length - 1 ? 0 : currentIndex + 1
    );
  const prevSlide = () =>
    scrollToIndex(
      currentIndex === 0 ? appointments.length - 1 : currentIndex - 1
    );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  if (loading) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ color: "#6b7280" }}>No upcoming appointments</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={appointments}
        keyExtractor={(item) => item.appointmentId}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: CARD_SPACING / 2 }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: SCREEN_WIDTH - CARD_SPACING }]}>
            <Pressable onPress={() => router.push("/appointments")}>
              <AppointmentCard appointment={item} />
            </Pressable>
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
            <View
              key={idx}
              style={[styles.dot, idx === currentIndex && styles.activeDot]}
            />
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
  container: { paddingVertical: 16 },
  card: { borderRadius: 16 },
  navigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: { padding: 8 },
  dotsContainer: { flexDirection: "row", marginHorizontal: 16 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#14b8a6" },
});

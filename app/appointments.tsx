import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppointmentCard from "@/assets/components/appointmentCard";
import AppointmentSlider from "@/assets/components/appointmentScroll";
import AppointmentCardExpired from "@/assets/components/appointmentCardExpired";

// --- Theme
const BRAND_GREEN = "#4A934A";
const SURFACE = "#FFFFFF";
const TEAL = "#5D9C9C";
const CHIP_BG = "rgba(255,255,255,0.2)";
const TEXT_PRIMARY = "#1E1E1E";
const TEXT_SECONDARY = "#6A6A6A";
const CARD_BG = "#F3F5F7";

// --- Sample Data
const ongoing = {
  title: "General Appointment",
  place: "OPD  @  Colombo National Hospital",
  dateLabel: "Wed, 10 Jan, 2024",
  timeLabel: "Morning set: 11:00",
};

const previous = Array.from({ length: 3 }).map(() => ({
  title: "General Appointment",
  place: "OPD  @  Colombo National Hospital",
  dateLabel: "Wed, 10 Jan, 2024",
  timeLabel: "Morning set: 11:00",
}));

function formatDate(d?: Date) {
  if (!d) return "";
  // dd/MM
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

export default function AppointmentsScreen() {
  const router = useRouter();

  // Range picker state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickingStart, setPickingStart] = useState(true); // start -> end

  // The text shown in the date field
  const dateRangeLabel = useMemo(() => {
    if (startDate && endDate)
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    if (startDate && !endDate) return `${formatDate(startDate)} - ..`;
    return "Select date range";
  }, [startDate, endDate]);

  const openRangePicker = () => {
    setPickingStart(true);
    setShowPicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Handle Android dismiss
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowPicker(false);
      setPickingStart(true);
      return;
    }

    const current = selected ?? new Date();

    if (pickingStart) {
      // Set start date and move to end date selection
      setStartDate(current);
      // Reset end date if it's before new start
      if (endDate && endDate < current) setEndDate(null);

      if (Platform.OS === "android") {
        // Android shows one dialog at a time: reopen for end
        setPickingStart(false);
        setShowPicker(true);
      } else {
        // iOS keeps inline/modal open; flip the state
        setPickingStart(false);
      }
    } else {
      // Picking end date
      // Ensure end >= start
      if (startDate && current < startDate) {
        setEndDate(startDate); // snap to start if invalid
      } else {
        setEndDate(current);
      }

      if (Platform.OS === "android") {
        setShowPicker(false);
      }
      setPickingStart(true); // reset for next time
    }

    // On iOS inline display, keep it visible until user taps outside; here we keep it visible.
    if (Platform.OS === "ios") setShowPicker(true);
  };

  // Minimum date constraints for better UX
  const pickerValue = pickingStart
    ? startDate ?? new Date()
    : endDate ?? startDate ?? new Date();
  const minimumDate = pickingStart ? new Date() : startDate ?? new Date();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={BRAND_GREEN} />

      {/* Header with green background */}
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.profileIconContainer}>
            <Feather name="user" size={26} color={BRAND_GREEN} />
          </View>
        </View>
      </View>

      {/* Sheet */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Appointments</Text>

        {/* Ongoing Appointments Section */}
        <Text style={styles.sectionLabel}>Ongoing Appointments</Text>
        <View style={styles.ongoingCard}>
          <AppointmentSlider />
        </View>

        {/* Date Range Row */}
        <Text style={styles.dateLabel}>Date</Text>
        <TouchableOpacity
          style={styles.dateRangeBtn}
          accessibilityRole="button"
          accessibilityLabel="Change date range"
          onPress={openRangePicker}
          activeOpacity={0.8}
        >
          <Text style={styles.dateRangeText}>{dateRangeLabel}</Text>
          <Feather name="chevron-down" size={18} color={TEXT_PRIMARY} />
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            testID="appointmentsRangePicker"
            value={pickerValue}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            minimumDate={minimumDate}
          />
        )}

        {/* Previous Section */}
        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
          Previous Appointments
        </Text>
        <View style={{ gap: 12 }}>
          {previous.map((item, idx) => (
            <View key={idx} style={styles.prevCard}>
              <View style={styles.prevHeader}>
                <View style={styles.titleRow}>
                  <View
                    style={[styles.iconBadge, { backgroundColor: "#ECEFF1" }]}
                  >
                    <FontAwesome
                      name="calendar"
                      size={18}
                      color={TEXT_SECONDARY}
                    />
                  </View>
                  <View>
                    <Text style={styles.prevTitle}>{item.title}</Text>
                    <Text style={styles.prevSubtitle}>{item.place}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.prevChipsRow}>
                <View style={styles.prevChip}>
                  <FontAwesome name="calendar" size={12} color={TEXT_PRIMARY} />
                  <Text style={styles.prevChipText}>{item.dateLabel}</Text>
                </View>
                <View style={styles.prevChip}>
                  <FontAwesome name="clock-o" size={12} color={TEXT_PRIMARY} />
                  <Text style={styles.prevChipText}>{item.timeLabel}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_GREEN },
  headerBg: {
    height: 160,
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#FFFFFF", fontSize: 16, marginLeft: 8 },
  profileIconContainer: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 50,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  sheet: {
    flex: 1,
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  sheetContent: { padding: 20, paddingBottom: 40 },

  h1: { fontSize: 26, fontWeight: "700", color: TEXT_PRIMARY, marginBottom: 8 },
  sectionLabel: { fontSize: 14, color: TEXT_SECONDARY, marginBottom: 10 },

  ongoingCard: {
    position: "relative",
    marginHorizontal: -20,
  },
  ongoingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  iconBadge: {
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  cardSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 },
  callBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginVertical: 12,
  },
  chipsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CHIP_BG,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  chipText: { color: "#FFFFFF", fontSize: 12 },

  dateLabel: { marginTop: 16, fontSize: 14, color: TEXT_SECONDARY },
  dateRangeBtn: {
    marginTop: 8,
    height: 44,
    borderWidth: 1,
    borderColor: "#E3E5E7",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateRangeText: { color: TEXT_PRIMARY, fontSize: 14, fontWeight: "600" },

  prevCard: { backgroundColor: CARD_BG, borderRadius: 14, padding: 14 },
  prevHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prevTitle: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: "700" },
  prevSubtitle: { color: TEXT_SECONDARY, fontSize: 12, marginTop: 2 },
  prevChipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  prevChip: {
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E6E9ED",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  prevChipText: { color: TEXT_PRIMARY, fontSize: 12, fontWeight: "500" },
});

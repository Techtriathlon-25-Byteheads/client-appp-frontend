import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Appointment = {
  title: string;
  location: string;
  status: string;
  date: string;
  time: string;
};

type Props = {
  appointment: Appointment;
};

const AppointmentCard: React.FC<Props> = ({ appointment }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={24} color="white" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{appointment.title}</Text>
              <Text style={styles.location}>{appointment.location}</Text>
            </View>
          </View>
        </View>
        {/* Date & Time with Status */}
        <View style={styles.dateStatusContainer}>
          <View style={styles.dateTimeContainerMain}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color="rgba(255, 255, 255, 0.7)"
                />
                <Text style={styles.dateTimeText}>{appointment.date}</Text>
              </View>

              <View style={styles.dateTimeItem}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="rgba(255, 255, 255, 0.7)"
                />
                <Text style={styles.dateTimeText}>{appointment.time}</Text>
              </View>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment.status) },
              ]}
            >
              <Text style={styles.statusText}>{appointment.status}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 16,
  },
  cardInner: {
    backgroundColor: "#569099",
    borderRadius: 16,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "white",
  },
  location: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  dateStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dateTimeContainerMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#3F838E",
    borderRadius: 12,
    padding: 15,
    width: "100%",
  },
  dateTimeContainer: {
    borderRadius: 12,
    justifyContent: "center",
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 2,
  },
  dateTimeText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontWeight: "500",
  },
});

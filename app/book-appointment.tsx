import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

// Time slot data
const timeSlots = [
    { time: '8am - 9am', status: '5 in the queue', available: true },
    { time: '10am - 12am', status: 'Queue is full', available: false },
    { time: '1pm - 2pm', status: '4 in the queue', available: true },
    { time: '3pm - 5pm', status: '5 in the queue', available: false },
    { time: '5pm - 7pm', status: 'Queue is full', available: false },
    { time: '2pm - 3pm', status: 'Queue is full', available: false },
    { time: '3pm - 4pm', status: '5 in the queue', available: false },
    { time: '4pm - 5pm', status: '4 in the queue', available: true },
];


export default function BookAppointment() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>('8am - 9am');

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor="#4A934A" />

            {/* --- Fixed Green Background Header --- */}
            <View style={styles.greenBackground}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#FFFFFF" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileIconContainer}>
                        <Feather name="user" size={28} color="#4A934A" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- White Content Sheet --- */}
            <View style={styles.whiteSheet}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Book an Appointment</Text>
                    <Text style={styles.subtitle}>Fill appointment details and continue</Text>

                    {/* --- Form --- */}
                    <Text style={styles.label}>Select a hospital</Text>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="search" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Colombo Hospital"
                            style={styles.input}
                            placeholderTextColor="#888"
                        />
                    </View>

                    <Text style={styles.label}>Select a date</Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.inputContainer}>
                        <TextInput
                            value={date.toLocaleDateString('en-GB').replace(/\//g, '/')}
                            style={styles.input}
                            editable={false} // Prevents keyboard from appearing
                            placeholderTextColor="#333"
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    <Text style={styles.label}>Select an available time slot</Text>
                    <View style={styles.timeSlotContainer}>
                        {timeSlots.map((slot, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.timeSlot,
                                    !slot.available && styles.timeSlotDisabled,
                                    selectedSlot === slot.time && styles.timeSlotSelected,
                                ]}
                                disabled={!slot.available}
                                onPress={() => setSelectedSlot(slot.time)}
                            >
                                <Text style={[
                                    styles.timeSlotText,
                                    !slot.available && styles.timeSlotTextDisabled,
                                    selectedSlot === slot.time && styles.timeSlotTextSelected
                                ]}>{slot.time}</Text>
                                <Text style={[
                                    styles.timeSlotSubText,
                                    !slot.available && styles.timeSlotTextDisabled,
                                     selectedSlot === slot.time && styles.timeSlotTextSelected
                                ]}>{slot.status}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* --- Confirm Button --- */}
                    <TouchableOpacity style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm booking</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4A934A',
    },
    greenBackground: {
        height: 150,
        backgroundColor: '#4A934A',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30, // Adjust for status bar
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginLeft: 8,
    },
    profileIconContainer: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 25,
    },
    whiteSheet: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30, // Overlap the green background
        paddingTop: 20,
    },
    contentContainer: {
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    timeSlotContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    timeSlot: {
        width: '48%',
        backgroundColor: '#F7F7F7',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeSlotSelected: {
        backgroundColor: '#4A934A',
        borderColor: '#4A934A',
    },
    timeSlotDisabled: {
        backgroundColor: '#E0E0E0',
    },
    timeSlotText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    timeSlotSubText: {
        fontSize: 11,
        color: '#666',
    },
    timeSlotTextSelected: {
        color: '#FFFFFF',
    },
    timeSlotTextDisabled: {
        color: '#999',
    },
    confirmButton: {
        backgroundColor: '#4A934A',
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 30,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

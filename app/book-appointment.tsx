import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEPARTMENTS, Service } from '../constants/departments';
import { REQUIRED_DOCUMENTS } from '../constants/documents';
import { LOCATIONS, Location } from '../constants/locations';
import { EVENING_SLOTS, MORNING_SLOTS, TimeSlot } from '../constants/timeSlots';

// --- Theme
const BRAND_GREEN = '#4A934A';
const SURFACE = '#FFFFFF';
const CHIP_BG = 'rgba(255,255,255,0.2)';
const TEXT_PRIMARY = '#1E1E1E';
const TEXT_SECONDARY = '#6A6A6A';

const { width } = Dimensions.get('window');

export default function BookAppointment() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, { name: string; type: string }>>({});;
    const [step, setStep] = useState(1); // 1: Select Service, 2: Date & Time, 3: OTP, 4: Confirm

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const toggleDepartment = (departmentId: string) => {
        setExpandedDepartment(expandedDepartment === departmentId ? null : departmentId);
    };

    const selectService = (service: Service) => {
        setSelectedService(service);
        setStep(2);
    };

    const goBack = () => {
        if (step === 1) {
            router.back();
        } else {
            setSelectedService(null);
            setStep(step - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Green Header */}
            <View style={styles.greenHeader}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
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

            {/* White Content Area */}
            <View style={styles.whiteContent}>
                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
                    <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
                    <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]} />
                    <View style={[styles.progressStep, step >= 4 && styles.progressStepActive]} />
                </View>

                {/* Title */}
                <Text style={styles.mainTitle}>Book an Appointment</Text>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {step === 3 && (
                    <>
                        <Text style={styles.sectionTitle}>Add Documents</Text>
                        <Text style={styles.sectionSubtitle}>
                            Please submit these required documents to secure your appointment and avoid service delays.
                        </Text>

                        <View style={styles.documentsGrid}>
                            {REQUIRED_DOCUMENTS.map((doc) => (
                                <TouchableOpacity
                                    key={doc.id}
                                    style={styles.documentUploadCard}
                                    onPress={async () => {
                                        try {
                                            const result = await DocumentPicker.getDocumentAsync({
                                                type: 'application/pdf',
                                                copyToCacheDirectory: true
                                            });
                                            
                                            if (result.assets && result.assets.length > 0) {
                                                const file = result.assets[0];
                                                setUploadedDocuments(prev => ({
                                                    ...prev,
                                                    [doc.id]: {
                                                        name: file.name,
                                                        type: file.mimeType || 'application/pdf',
                                                        uri: file.uri
                                                    }
                                                }));
                                            }
                                        } catch (err) {
                                            console.error('Error picking document:', err);
                                            // You might want to show an error message to the user here
                                        }
                                    }}
                                >
                                    <View style={[
                                        styles.documentIconContainer,
                                        uploadedDocuments[doc.id] && styles.documentIconContainerSuccess
                                    ]}>
                                        {uploadedDocuments[doc.id] ? (
                                            <MaterialCommunityIcons name="check" size={32} color={SURFACE} />
                                        ) : (
                                            <MaterialCommunityIcons name="file-upload-outline" size={32} color={BRAND_GREEN} />
                                        )}
                                    </View>
                                    <Text style={styles.documentName}>{doc.name}</Text>
                                    {uploadedDocuments[doc.id] && (
                                        <Text style={styles.documentUploaded} numberOfLines={1} ellipsizeMode="middle">
                                            {uploadedDocuments[doc.id].name}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {step === 2 && selectedService && (
                    <>
                        <Text style={styles.sectionTitle}>Select Date & Time</Text>
                        {/* Date Selection */}
                        <View style={styles.dateSection}>
                            <Text style={styles.dateLabel}>Select the Date</Text>
                            <TouchableOpacity 
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {date.toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </Text>
                                <MaterialIcons name="calendar-today" size={24} color={BRAND_GREEN} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setDate(selectedDate);
                                        }
                                    }}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>

                        {/* Time Slots */}
                        {/* Location Selection */}
                        <View style={styles.locationSection}>
                            <Text style={styles.locationLabel}>Select Location</Text>
                            <TouchableOpacity 
                                style={[
                                    styles.locationButton,
                                    showLocationDropdown && styles.locationButtonActive
                                ]}
                                onPress={() => setShowLocationDropdown(!showLocationDropdown)}
                            >
                                <Text style={styles.locationText}>
                                    {selectedLocation ? selectedLocation.name : 'Select a location'}
                                </Text>
                                <MaterialIcons 
                                    name={showLocationDropdown ? "expand-less" : "expand-more"} 
                                    size={24} 
                                    color={TEXT_SECONDARY}
                                />
                            </TouchableOpacity>
                            {showLocationDropdown && (
                                <View style={styles.locationDropdown}>
                                    <ScrollView style={styles.locationList} nestedScrollEnabled>
                                        {LOCATIONS.map((location) => (
                                            <TouchableOpacity
                                                key={location.id}
                                                style={[
                                                    styles.locationItem,
                                                    selectedLocation?.id === location.id && styles.locationItemSelected
                                                ]}
                                                onPress={() => {
                                                    setSelectedLocation(location);
                                                    setShowLocationDropdown(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.locationItemText,
                                                    selectedLocation?.id === location.id && styles.locationItemTextSelected
                                                ]}>{location.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <View style={styles.timeSlotsSection}>
                            <Text style={styles.timeLabel}>Select an available time slot</Text>
                            
                            {/* Morning Slots */}
                            <Text style={styles.periodLabel}>Morning Hours</Text>
                            <View style={styles.timeSlotGrid}>
                                {MORNING_SLOTS.map((slot) => (
                                    <TouchableOpacity
                                        key={slot.id}
                                        style={[
                                            styles.timeSlot,
                                            selectedTimeSlot?.id === slot.id && styles.timeSlotSelected
                                        ]}
                                        onPress={() => setSelectedTimeSlot(slot)}
                                    >
                                        <Text style={[
                                            styles.timeSlotText,
                                            selectedTimeSlot?.id === slot.id && styles.timeSlotTextSelected
                                        ]}>{slot.time}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Evening Slots */}
                            <Text style={styles.periodLabel}>Evening Hours</Text>
                            <View style={styles.timeSlotGrid}>
                                {EVENING_SLOTS.map((slot) => (
                                    <TouchableOpacity
                                        key={slot.id}
                                        style={[
                                            styles.timeSlot,
                                            selectedTimeSlot?.id === slot.id && styles.timeSlotSelected
                                        ]}
                                        onPress={() => setSelectedTimeSlot(slot)}
                                    >
                                        <Text style={[
                                            styles.timeSlotText,
                                            selectedTimeSlot?.id === slot.id && styles.timeSlotTextSelected
                                        ]}>{slot.time}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}

                {step === 1 && (
                    <>
                        <Text style={styles.sectionTitle}>Select Service</Text>
                        <View style={styles.departmentList}>
                            {DEPARTMENTS.map((dept) => (
                                <View key={dept.id}>
                                    <TouchableOpacity
                                        style={[
                                            styles.departmentItem,
                                            expandedDepartment === dept.id && styles.departmentItemActive
                                        ]}
                                        onPress={() => toggleDepartment(dept.id)}
                                    >
                                        <MaterialIcons 
                                            name="apartment" 
                                            size={24} 
                                            color={expandedDepartment === dept.id ? SURFACE : BRAND_GREEN} 
                                        />
                                        <Text style={[
                                            styles.departmentName,
                                            expandedDepartment === dept.id && styles.departmentNameActive
                                        ]}>{dept.name}</Text>
                                        <MaterialIcons 
                                            name={expandedDepartment === dept.id ? "expand-less" : "expand-more"} 
                                            size={24} 
                                            color={expandedDepartment === dept.id ? SURFACE : "#666"} 
                                        />
                                    </TouchableOpacity>
                                    {expandedDepartment === dept.id && (
                                        <View style={styles.serviceDropdown}>
                                            {dept.services.map((service) => (
                                                <TouchableOpacity
                                                    key={service.id}
                                                    style={styles.serviceItem}
                                                    onPress={() => selectService(service)}
                                                >
                                                    <MaterialIcons name="description" size={24} color={BRAND_GREEN} />
                                                    <Text style={styles.serviceName}>{service.name}</Text>
                                                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </>
                )}
                </ScrollView>

                {/* Navigation Buttons */}
                <View style={styles.navigationButtons}>
                    {step > 1 && (
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={() => {
                                setSelectedService(null);
                                setStep(step - 1);
                            }}
                        >
                            <Text style={styles.navigationButtonText}>Previous Step</Text>
                        </TouchableOpacity>
                    )}
                    {(
                        step === 1 && selectedService || 
                        (step === 2 && selectedTimeSlot && selectedLocation) ||
                        (step === 3 && Object.keys(uploadedDocuments).length === REQUIRED_DOCUMENTS.length)
                    ) && (
                        <TouchableOpacity
                            style={[styles.navigationButton, styles.navigationButtonPrimary]}
                            onPress={() => {
                                if (step === 3) {
                                    router.replace({
                                        pathname: '/booking-confirmation',
                                        params: {
                                            serviceName: selectedService?.name,
                                            date: date.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
                                            time: selectedTimeSlot?.time,
                                            phone: '0763951245', // Replace with actual phone if available
                                        },
                                    });
                                } else {
                                    setStep(step + 1);
                                }
                            }}
                        >
                            <Text style={[styles.navigationButtonText, styles.navigationButtonTextPrimary]}>
                                {step === 3 ? 'Finish' : 'Next Step'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND_GREEN,
    },
    greenHeader: {
        height: 140,
        backgroundColor: BRAND_GREEN,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 8,
    },
    backButtonText: {
        color: SURFACE,
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '500',
    },
    profileButton: {
        padding: 8,
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: CHIP_BG,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteContent: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        overflow: 'hidden',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 16,
    },
    progressBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        gap: 8,
    },
    progressStep: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    progressStepActive: {
        backgroundColor: '#4A934A',
    },
    content: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    contentContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
        marginBottom: 16,
    },
    departmentList: {
        gap: 12,
    },
    departmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    departmentName: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#111',
    },
    departmentItemActive: {
        backgroundColor: BRAND_GREEN,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        borderColor: BRAND_GREEN,
    },
    departmentNameActive: {
        color: SURFACE,
    },
    serviceDropdown: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginBottom: 12,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    serviceName: {
        flex: 1,
        fontSize: 16,
        color: TEXT_PRIMARY,
        marginLeft: 12,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    navigationButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    navigationButtonPrimary: {
        backgroundColor: '#4A934A',
    },
    navigationButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    navigationButtonTextPrimary: {
        color: '#fff',
    },
    dateSection: {
        marginBottom: 24,
    },
    locationSection: {
        marginBottom: 24,
        zIndex: 1,
    },
    locationLabel: {
        fontSize: 16,
        color: TEXT_PRIMARY,
        marginBottom: 8,
    },
    locationButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    locationButtonActive: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    locationText: {
        fontSize: 16,
        color: TEXT_PRIMARY,
    },
    locationDropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    locationList: {
        maxHeight: 200,
    },
    locationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    locationItemSelected: {
        backgroundColor: '#F3F4F6',
    },
    locationItemText: {
        fontSize: 16,
        color: TEXT_PRIMARY,
    },
    locationItemTextSelected: {
        color: BRAND_GREEN,
        fontWeight: '500',
    },
    dateLabel: {
        fontSize: 16,
        color: TEXT_PRIMARY,
        marginBottom: 8,
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateText: {
        fontSize: 16,
        color: TEXT_PRIMARY,
    },
    timeSlotsSection: {
        marginBottom: 24,
    },
    timeLabel: {
        fontSize: 16,
        color: TEXT_PRIMARY,
        marginBottom: 16,
    },
    periodLabel: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        marginBottom: 12,
        marginTop: 16,
    },
    timeSlotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    timeSlot: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        minWidth: width / 4 - 12,
        alignItems: 'center',
    },
    timeSlotSelected: {
        backgroundColor: BRAND_GREEN,
    },
    timeSlotText: {
        fontSize: 14,
        color: TEXT_PRIMARY,
    },
    timeSlotTextSelected: {
        color: SURFACE,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        marginHorizontal: 16,
        marginTop: -8,
        marginBottom: 24,
    },
    documentsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        padding: 16,
    },
    documentUploadCard: {
        width: (width - 48) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    documentIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    documentIconContainerSuccess: {
        backgroundColor: BRAND_GREEN,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '500',
        color: TEXT_PRIMARY,
        textAlign: 'center',
        marginBottom: 4,
    },
    documentUploaded: {
        fontSize: 12,
        color: TEXT_SECONDARY,
        textAlign: 'center',
        maxWidth: '100%',
    },
});

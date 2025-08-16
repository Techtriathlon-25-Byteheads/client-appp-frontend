import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo } from 'react';
import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { api, Department, Service, Slot } from '@/services/api';
import { connectSocket, disconnectSocket, joinServiceQueue, onQueueUpdate, bookAppointment, onAppointmentBooked, onError } from '@/services/socket';

// --- Theme
const BRAND_GREEN = '#4A934A';
const SURFACE = '#FFFFFF';
const TEXT_PRIMARY = '#1E1E1E';
const TEXT_SECONDARY = '#6A6A6A';

const { width } = Dimensions.get('window');

export default function BookAppointment() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedService, setSelectedService] = useState<(Service & { departmentId: string }) | null>(null);
    const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, { name: string; type: string }>>({});
    const [step, setStep] = useState(1);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedDepartments = await api.getDepartments();
                setDepartments(fetchedDepartments);
            } catch (error) {
                console.error("Failed to fetch departments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const setupSocket = async () => {
            await connectSocket();

            onQueueUpdate(({ serviceId, slots }) => {
                if (serviceId === selectedService?.id) {
                    setSlots(slots);
                }
            });

            onAppointmentBooked((data) => {
                if (selectedService) {
                    router.replace({
                        pathname: '/bookConfirmation',
                        params: {
                            serviceName: selectedService.name,
                            date: new Date(data.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
                            time: data.appointmentTime,
                            phone: '0763951245',
                        },
                    });
                }
            });

            onError((error) => {
                console.error("Socket error:", error);
            });
        };

        if (selectedService) {
            setupSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [selectedService]);

    const handleSelectService = async (service: { serviceId: string; serviceName: string }, department: Department) => {
        try {
            const details = await api.getServiceById(service.serviceId);
            setServiceDetails(details);
            setSelectedService({ ...details, id: service.serviceId, name: service.serviceName, departmentId: department.id });
            joinServiceQueue(service.serviceId);
            setStep(2);
        } catch (error) {
            console.error("Failed to fetch service details:", error);
        }
    };

    const handleDateSelect = async (date: Date) => {
        setSelectedDate(date);
        if (selectedService) {
            try {
                setLoadingSlots(true);
                const dateString = date.toISOString().split('T')[0];
                const fetchedSlots = await api.getSlotsForService(selectedService.id, dateString);
                setSlots(fetchedSlots);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        }
    };

    const handleBookAppointment = () => {
        if (selectedService && selectedSlot && selectedDate) {
            bookAppointment({
                departmentId: selectedService.departmentId,
                serviceId: selectedService.id,
                appointmentDate: selectedDate.toISOString().split('T')[0],
                appointmentTime: selectedSlot.time,
            });
            setStep(3);
        }
    };

    const getRequiredDocumentsList = useMemo(() => {
        if (!serviceDetails?.requiredDocuments) return [];
        const { usual, other } = serviceDetails.requiredDocuments;
        const documents = other && Array.isArray(other) ? other.filter(doc => doc && doc.trim() !== '') : [];
        if (usual && typeof usual === 'object') {
            for (const key in usual) {
                if (usual[key]) {
                    documents.push(key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
                }
            }
        }
        return documents;
    }, [serviceDetails]);

    const goBack = () => {
        if (step === 1) router.back();
        else setStep(step - 1);
    };

    const availableDates = useMemo(() => {
        if (!serviceDetails?.operationalHours) return [];

        const dayMap: { [key: string]: number } = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
        const availableWeekdays = Object.entries(serviceDetails.operationalHours)
            .filter(([, hours]) => Array.isArray(hours) && hours.length > 0)
            .map(([day]) => dayMap[day.toLowerCase()]);

        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            if (availableWeekdays.includes(date.getDay())) {
                dates.push(date);
            }
        }
        return dates;
    }, [serviceDetails]);

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color={SURFACE} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.greenHeader}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={SURFACE} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.whiteContent}>
                <Text style={styles.mainTitle}>Book an Appointment</Text>
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {step === 1 && (
                        <>
                            <Text style={styles.sectionTitle}>Select Service</Text>
                            <View style={styles.departmentList}>
                                {departments.map((dept) => (
                                    <View key={dept.id}>
                                        <TouchableOpacity
                                            style={[styles.departmentItem, expandedDepartment === dept.id && styles.departmentItemActive]}
                                            onPress={() => setExpandedDepartment(expandedDepartment === dept.id ? null : dept.id)}
                                        >
                                            <MaterialIcons name="apartment" size={24} color={expandedDepartment === dept.id ? SURFACE : BRAND_GREEN} />
                                            <View style={{ flex: 1, marginLeft: 12 }}>
                                                <Text style={[styles.departmentName, expandedDepartment === dept.id && styles.departmentNameActive]}>{dept.departmentName}</Text>
                                                <Text style={[styles.departmentCity, expandedDepartment === dept.id && styles.departmentCityActive]}>{dept.city}</Text>
                                            </View>
                                            <MaterialIcons name={expandedDepartment === dept.id ? "expand-less" : "expand-more"} size={24} color={expandedDepartment === dept.id ? SURFACE : "#666"} />
                                        </TouchableOpacity>
                                        {expandedDepartment === dept.id && (
                                            <View style={styles.serviceDropdown}>
                                                {dept.services.map((service) => (
                                                    <TouchableOpacity key={service.serviceId} style={styles.serviceItem} onPress={() => handleSelectService(service, dept)}>
                                                        <MaterialIcons name="description" size={24} color={BRAND_GREEN} />
                                                        <Text style={styles.serviceName}>{service.serviceName}</Text>
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

                    {step === 2 && (
                        <>
                            <Text style={styles.sectionTitle}>Select Date & Time</Text>
                            <View style={styles.dateSection}>
                                <Text style={styles.dateLabel}>Select a Date</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroller}>
                                    {availableDates.map(date => (
                                        <TouchableOpacity 
                                            key={date.toISOString()}
                                            style={[styles.dateChip, selectedDate?.toISOString() === date.toISOString() && styles.dateChipSelected]}
                                            onPress={() => handleDateSelect(date)}
                                        >
                                            <Text style={[styles.dateChipText, selectedDate?.toISOString() === date.toISOString() && styles.dateChipTextSelected]}>
                                                {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {selectedDate && (
                                <View style={styles.timeSlotsSection}>
                                    <Text style={styles.timeLabel}>Select an available time slot</Text>
                                    {loadingSlots ? <ActivityIndicator /> : (
                                        <View style={styles.timeSlotGrid}>
                                            {slots.length > 0 ? slots.map((slot) => (
                                                <TouchableOpacity
                                                    key={slot.time}
                                                    style={[styles.timeSlot, selectedSlot?.time === slot.time && styles.timeSlotSelected, !slot.isAvailable && styles.timeSlotDisabled]}
                                                    onPress={() => setSelectedSlot(slot)}
                                                    disabled={!slot.isAvailable}
                                                >
                                                    <Text style={[styles.timeSlotText, selectedSlot?.time === slot.time && styles.timeSlotTextSelected]}>{slot.time}</Text>
                                                    <Text style={styles.queueText}>{slot.currentQueueSize}/{slot.maxCapacity} in queue</Text>
                                                </TouchableOpacity>
                                            )) : <Text>No slots available for this date.</Text>}
                                        </View>
                                    )}
                                </View>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Text style={styles.sectionTitle}>Add Documents</Text>
                            <View style={styles.documentsGrid}>
                                {getRequiredDocumentsList.map((docName) => (
                                    <TouchableOpacity
                                        key={docName}
                                        style={styles.documentUploadCard}
                                        onPress={async () => {
                                            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
                                            if (result.assets && result.assets.length > 0) {
                                                const file = result.assets[0];
                                                setUploadedDocuments(prev => ({ ...prev, [docName]: { name: file.name, type: file.mimeType || 'application/pdf' } }));
                                            }
                                        }}
                                    >
                                        <View style={[styles.documentIconContainer, uploadedDocuments[docName] && styles.documentIconContainerSuccess]}>
                                            {uploadedDocuments[docName] ? <MaterialCommunityIcons name="check" size={32} color={SURFACE} /> : <MaterialCommunityIcons name="file-upload-outline" size={32} color={BRAND_GREEN} />}
                                        </View>
                                        <Text style={styles.documentName}>{docName}</Text>
                                        {uploadedDocuments[docName] && <Text style={styles.documentUploaded} numberOfLines={1}>{uploadedDocuments[docName].name}</Text>}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </ScrollView>

                <View style={styles.navigationButtons}>
                    {step > 1 && (
                        <TouchableOpacity style={styles.navigationButton} onPress={goBack}>
                            <Text style={styles.navigationButtonText}>Previous Step</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.navigationButton, styles.navigationButtonPrimary, (!selectedSlot && step === 2) && styles.disabledButton]}
                        onPress={() => {
                            if (step === 2) handleBookAppointment();
                            else if (step === 3) router.replace('/'); // Or wherever confirmation is shown
                        }}
                        disabled={!selectedSlot && step === 2}
                    >
                        <Text style={[styles.navigationButtonText, styles.navigationButtonTextPrimary]}>
                            {step === 2 ? 'Book Appointment' : (step === 3 ? 'Finish' : 'Next Step')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BRAND_GREEN, justifyContent: 'center' },
    greenHeader: { height: 140, backgroundColor: BRAND_GREEN, paddingTop: Platform.OS === 'ios' ? 50 : 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 56 },
    backButton: { flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 8 },
    backButtonText: { color: SURFACE, fontSize: 16, marginLeft: 8, fontWeight: '500' },
    whiteContent: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, overflow: 'hidden' },
    mainTitle: { fontSize: 24, fontWeight: '600', color: '#111', marginHorizontal: 16, marginTop: 20, marginBottom: 16 },
    content: { flex: 1, backgroundColor: '#F9FAFB' },
    contentContainer: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 16 },
    departmentList: { gap: 12 },
    departmentItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    departmentName: { fontSize: 16, color: '#111', fontWeight: 'bold' },
    departmentCity: { fontSize: 14, color: TEXT_SECONDARY },
    departmentItemActive: { backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN },
    departmentNameActive: { color: SURFACE },
    departmentCityActive: { color: '#E6F4EA' },
    serviceDropdown: { backgroundColor: '#FFFFFF', borderTopWidth: 0, borderColor: '#E5E7EB', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginBottom: 12, borderWidth: 1, borderTopColor: 'transparent' },
    serviceItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    serviceName: { flex: 1, fontSize: 16, color: TEXT_PRIMARY, marginLeft: 12 },
    navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff' },
    navigationButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
    navigationButtonPrimary: { backgroundColor: '#4A934A' },
    navigationButtonText: { fontSize: 16, fontWeight: '500', color: '#374151' },
    navigationButtonTextPrimary: { color: '#fff' },
    disabledButton: { backgroundColor: '#A5D6A7' },
    dateSection: { marginBottom: 24 },
    dateLabel: { fontSize: 16, color: TEXT_PRIMARY, marginBottom: 12 },
    dateScroller: { paddingBottom: 10 },
    dateChip: { backgroundColor: '#F3F4F6', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginRight: 10 },
    dateChipSelected: { backgroundColor: BRAND_GREEN },
    dateChipText: { color: TEXT_PRIMARY, fontWeight: '500' },
    dateChipTextSelected: { color: SURFACE },
    timeSlotsSection: { marginBottom: 24 },
    timeLabel: { fontSize: 16, color: TEXT_PRIMARY, marginBottom: 16 },
    timeSlotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    timeSlot: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, minWidth: width / 3 - 20, alignItems: 'center' },
    timeSlotSelected: { backgroundColor: BRAND_GREEN },
    timeSlotDisabled: { backgroundColor: '#E0E0E0' },
    timeSlotText: { fontSize: 14, color: TEXT_PRIMARY },
    timeSlotTextSelected: { color: SURFACE },
    queueText: { fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 },
    documentsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 16 },
    documentUploadCard: { width: (width - 48) / 2, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    documentIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    documentIconContainerSuccess: { backgroundColor: BRAND_GREEN },
    documentName: { fontSize: 16, fontWeight: '500', color: TEXT_PRIMARY, textAlign: 'center', marginBottom: 4 },
    documentUploaded: { fontSize: 12, color: TEXT_SECONDARY, textAlign: 'center', maxWidth: '100%' },
});
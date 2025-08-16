// app/login.tsx
import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/services/api';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H_LOGIN = SCREEN_H * 0.75;   // 3/4 for Log In
const SHEET_H_SIGNUP = SCREEN_H * 0.80;  // Sign Up a bit taller
const SHEET_H_EXPANDED = SCREEN_H * 0.94;

type Mode = 'login' | 'signup';
type Lang = 'si' |'en'| 'ta' ;

const MIN_DOB = new Date(1850, 0, 1);
const TODAY = new Date();

/** i18n */
const I18N: Record<Lang, Record<string, string>> = {
  en: {
    getStartedTitle: 'Get Started Now',
    getStartedSubtitle: 'Sign Up or log in to experience National Health Hub',
    segmentLogin: 'Log In',
    segmentSignup: 'Sign Up',
    phoneLabel: 'Mobile Number',
    phonePlaceholder: '07* *** **34',
    nicLabel: 'NIC Number',
    nicPlaceholder: '200*******32',
    dobLabel: 'Date Of Birth',
    dobPlaceholder: 'Select date',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    addressLabel: 'Address',
    addressPlaceholder: 'No.8, Cross Road, Galle',
    contactLabel: 'Contact Number',
    contactPlaceholder: '07* *** **32',
    adultTitle: 'Adult patient',
    adultSub: 'Is the patient 18 year or older',
    rememberMe: 'Remember me',
    chooseLanguage: 'Choose Your Preferred Language',
    ctaLogin: 'Log in',
    ctaSignup: 'Sign Up',
    lang_si: 'සිං',
    lang_ta: 'தமிழ்',
    lang_en: 'En',
    phoneError: 'Please enter a valid 10-digit phone number',
    phoneErrorNonNumeric: 'Phone number can only contain numbers',
    phoneErrorLength: 'Phone number must be exactly 10 digits',
  },
  si: {
    getStartedTitle: 'දැන් ආරම්භ කරන්න',
    getStartedSubtitle: 'ජාතික සෞඛ්‍ය මධ්‍යස්ථානය භාවිතා කිරීමට ලියාපදිංචි වන්න හෝ පිවිසෙන්න',
    segmentLogin: 'පිවිසෙන්න',
    segmentSignup: 'ලියාපදිංචි වන්න',
    phoneLabel: 'ජංගම අංකය',
    phonePlaceholder: '07* *** **34',
    nicLabel: 'හැඳුනුම්පත් අංකය',
    nicPlaceholder: '200*******32',
    dobLabel: 'උපන් දිනය',
    dobPlaceholder: 'දිනය තෝරන්න',
    fullNameLabel: 'සම්පූර්ණ නම',
    fullNamePlaceholder: 'John Doe',
    addressLabel: 'ලිපිනය',
    addressPlaceholder: 'No.8, Cross Road, Galle',
    contactLabel: 'සම්බන්ධතා අංකය',
    contactPlaceholder: '07* *** **32',
    adultTitle: 'වැඩිවියන රෝගියා',
    adultSub: 'රෝගියා අවුරුදු 18 ක් හෝ ඊට වැඩියෙක්ද?',
    rememberMe: 'මාව මතක තබන්න',
    needHelp: 'උදව් අවශ්‍යද ?',
    chooseLanguage: 'ඔබ කැමති භාෂාව තෝරන්න',
    ctaLogin: 'පිවිසෙන්න',
    ctaSignup: 'ලියාපදිංචි වන්න',
    lang_si: 'සිං',
    lang_ta: 'தமிழ்',
    lang_en: 'En',
  },
  ta: {
    getStartedTitle: 'இப்போது தொடங்குங்கள்',
    getStartedSubtitle: 'தேசிய சுகாதார மையத்தைப் பயன்படுத்த பதிவு செய்யவோ உள்நுழையவோ செய்யுங்கள்',
    segmentLogin: 'உள்நுழைக',
    segmentSignup: 'பதிவு',
    phoneLabel: 'கைபேசி எண்',
    phonePlaceholder: '07* *** **34',
    nicLabel: 'தேசிய அடையாள எண்',
    nicPlaceholder: '200*******32',
    dobLabel: 'பிறந்த தேதி',
    dobPlaceholder: 'தேதியைத் தேர்வு செய்க',
    fullNameLabel: 'முழு பெயர்',
    fullNamePlaceholder: 'John Doe',
    addressLabel: 'முகவரி',
    addressPlaceholder: 'No.8, Cross Road, Galle',
    contactLabel: 'தொடர்பு எண்',
    contactPlaceholder: '07* *** **32',
    adultTitle: 'வயது வந்த நோயாளர்',
    adultSub: 'நோயாளி 18 வயது அல்லது அதற்கு மேற்பட்டவரா',
    rememberMe: 'என்னை நினைவில் வை',
    needHelp: 'உதவி வேண்டுமா ?',
    chooseLanguage: 'உங்களின் விருப்ப மொழியைத் தேர்வு செய்யவும்',
    ctaLogin: 'உள்நுழைக',
    ctaSignup: 'பதிவு செய்ய',
    lang_si: 'සිං',
    lang_ta: 'தமிழ்',
    lang_en: 'En',
  },
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>('login');
  const [lang, setLang] = useState<Lang>('en');

  // login fields
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  const [remember, setRemember] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // signup fields
  const [fullName, setFullName] = useState('');
  const [adult, setAdult] = useState(true);
  const [dob, setDob] = useState<Date | null>(null);
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  // validation flags
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const t = (k: string) => I18N[lang][k] ?? I18N.en[k] ?? k;

  // Height-animated sheet
  const baseHeight = useMemo(
    () => (mode === 'login' ? SHEET_H_LOGIN : SHEET_H_SIGNUP),
    [mode]
  );
  const anim = useRef(new Animated.Value(baseHeight)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) {
      Animated.timing(anim, {
        toValue: baseHeight,
        duration: 260,
        useNativeDriver: false,
      }).start();
    }
  }, [baseHeight, expanded, anim]);

  const animateTo = (h: number) =>
    Animated.timing(anim, {
      toValue: h,
      duration: 260,
      useNativeDriver: false,
    }).start();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 8 && !expanded) {
      setExpanded(true);
      animateTo(SHEET_H_EXPANDED);
    } else if (y <= 0 && expanded) {
      setExpanded(false);
      animateTo(baseHeight);
    }
  };

  // measure footer height to avoid overlap
  const [footerH, setFooterH] = useState(190);

  // ---- helpers ----
  const digitsOnly = (s: string) => (s || '').replace(/\D/g, '');
  const getPhoneError = (value: string): string | null => {
    if (!value) return null;
    if (value !== digitsOnly(value)) return t('phoneErrorNonNumeric');
    const digits = digitsOnly(value);
    if (digits.length !== 10) return t('phoneErrorLength');
    return null;
  };
  const isValidPhone = (s: string) => !getPhoneError(s);
  const nicOK = (s: string) => (s || '').trim().length >= 6;
  const notEmpty = (s: string) => (s || '').trim().length > 0;
  const dobOK = (d: Date | null) => !!d && d.getTime() > MIN_DOB.getTime() && d.getTime() <= TODAY.getTime();
  const fmtDate = (d?: Date | null) => (d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : '');

  const validateLogin = async () => {
    const next: Record<string, boolean> = {};
    next.phone = !isValidPhone(phone);
    next.nic = !nicOK(nic);
    setErrors(next);
    
    if (!next.phone && !next.nic) {
      try {
        setIsLoading(true);
        const response = await api.login(nic, phone);
        // Navigate to OTP screen with necessary params
        router.push({
          pathname: '/otp',
          params: {
            userId: response.userId,
            phone: phone,
            lang: lang
          }
        });
        return true;
      } catch (error) {
        setErrors(e => ({ ...e, apiError: true }));
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setErrors(e => ({ ...e, otp: true }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.verifyOTP(userId, otp);
      // Save token in secure storage or context
      // For now, just navigate to home
      router.replace('/');
    } catch (error) {
      setErrors(e => ({ ...e, otpError: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const validateSignup = async () => {
    const next: Record<string, boolean> = {};
    next.fullName = !notEmpty(fullName);
    next.nic = !nicOK(nic);
    next.dob = !dobOK(dob);
    next.address = !notEmpty(address);
    next.contact = !isValidPhone(contact);
    setErrors(next);

    if (Object.values(next).every(v => !v)) {
      try {
        setIsLoading(true);
        // Split address into street and city (assuming format: "No.8, Cross Road, Galle")
        const addressParts = address.split(',');
        const city = addressParts.pop()?.trim() || '';
        const street = addressParts.join(',').trim();

        const response = await api.signup({
          fullName,
          nic,
          dob: dob?.toISOString().split('T')[0] || '',
          address: { street, city },
          contactNumber: contact,
        });

        // Navigate to OTP screen with necessary params
        router.push({
          pathname: '/otp',
          params: {
            userId: response.userId,
            phone: contact, // use contact number for signup
            lang: lang
          }
        });
        return true;
      } catch (error) {
        setErrors(e => ({ ...e, apiError: true }));
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  };

  // clear a field's error on change
  const clearErr = (k: string) => setErrors((e) => ({ ...e, [k]: false }));

  // DOB picker
  const [showDobPicker, setShowDobPicker] = useState(false);
  const onPickDob = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDobPicker(false);
    }
    
    if (event.type === 'set' && selected) {
      setDob(selected);
      clearErr('dob');
    } else if (event.type === 'dismissed' && Platform.OS === 'ios') {
      setShowDobPicker(false);
    }
    clearErr('dob');
  };

  const ctaLabel = mode === 'login' ? t('ctaLogin') : t('ctaSignup');

  return (
    <LinearGradient
      colors={['#FFFFFF', '#4A934A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar style="dark" translucent />
      {Platform.OS === 'android' && <View style={{ height: RNStatusBar.currentHeight || 0 }} />}

      <SafeAreaView style={styles.topContainer} />

      <Animated.View style={[styles.sheet, { height: anim }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: insets.bottom + footerH + 12 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {/* Headings */}
            <Text style={styles.title}>{t('getStartedTitle')}</Text>
            <Text style={styles.subtitle}>{t('getStartedSubtitle')}</Text>

            {/* Segmented: Log In | Sign Up */}
            <View style={styles.segment}>
              <TouchableOpacity
                style={[styles.segmentItem, mode === 'login' && styles.segmentItemActive]}
                onPress={() => setMode('login')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                  {t('segmentLogin')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentItem, mode === 'signup' && styles.segmentItemActive]}
                onPress={() => setMode('signup')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>
                  {t('segmentSignup')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ---------- LOGIN FORM ---------- */}
            {mode === 'login' && (
              <>
                <Text style={styles.label}>{t('phoneLabel')}</Text>
                <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={(v) => {
                      if (v !== digitsOnly(v)) return; // Only allow numeric input
                      const digits = digitsOnly(v);
                      if (digits.length <= 10) {
                        setPhone(digits);
                        clearErr('phone');
                      }
                    }}
                    placeholder={t('phonePlaceholder')}
                    placeholderTextColor="#9AA3AE"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    maxLength={10}
                  />
                </View>
                {errors.phone && phone && (
                  <Text style={styles.errorText}>{getPhoneError(phone)}</Text>
                )}

                <Text style={styles.label}>{t('nicLabel')}</Text>
                <View style={[styles.inputWrapper, errors.nic && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={nic}
                    onChangeText={(v) => { setNic(v); clearErr('nic'); }}
                    placeholder={t('nicPlaceholder')}
                    placeholderTextColor="#9AA3AE"
                    autoCapitalize="characters"
                    returnKeyType="done"
                  />
                </View>
              </>
            )}

            {/* ---------- SIGNUP FORM ---------- */}
            {mode === 'signup' && (
              <>
                <Text style={styles.label}>{t('fullNameLabel')}</Text>
                <View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={(v) => { setFullName(v); clearErr('fullName'); }}
                    placeholder={t('fullNamePlaceholder')}
                    placeholderTextColor="#9AA3AE"
                    returnKeyType="next"
                  />
                </View>

                {/* Adult patient */}
                <Pressable style={styles.adultRow} onPress={() => setAdult(a => !a)}>
                  <Checkbox checked={adult} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adultTitle}>{t('adultTitle')}</Text>
                    <Text style={styles.adultSub}>{t('adultSub')}</Text>
                  </View>
                </Pressable>

                <Text style={styles.label}>{t('nicLabel')}</Text>
                <View style={[styles.inputWrapper, errors.nic && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={nic}
                    onChangeText={(v) => { setNic(v); clearErr('nic'); }}
                    placeholder={t('nicPlaceholder')}
                    placeholderTextColor="#9AA3AE"
                    autoCapitalize="characters"
                    returnKeyType="next"
                  />
                </View>

                <Text style={styles.label}>{t('dobLabel')}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDobPicker(true)}
                >
                  <View style={[styles.inputWrapper, errors.dob && styles.inputError, { justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={[styles.input, { color: dob ? '#111827' : '#9AA3AE', flex: 1 }]}>
                      {dob ? fmtDate(dob) : t('dobPlaceholder')}
                    </Text>
                    <Feather name="calendar" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>

                {showDobPicker && (Platform.OS === 'ios' ? (
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={dob || new Date(1990, 0, 1)}
                      mode="date"
                      display="inline"
                      onChange={onPickDob}
                      minimumDate={MIN_DOB}
                      maximumDate={TODAY}
                      textColor="#111827"
                      accentColor="#4A934A"
                      style={{ height: 400 }}
                    />
                    <TouchableOpacity
                      style={styles.datePickerDoneBtn}
                      onPress={() => setShowDobPicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <DateTimePicker
                    value={dob || new Date(1990, 0, 1)}
                    mode="date"
                    display="default"
                    onChange={onPickDob}
                    minimumDate={MIN_DOB}
                    maximumDate={TODAY}
                  />
                ))}

                <Text style={styles.label}>{t('addressLabel')}</Text>
                <View style={[styles.inputWrapper, errors.address && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={(v) => { setAddress(v); clearErr('address'); }}
                    placeholder={t('addressPlaceholder')}
                    placeholderTextColor="#9AA3AE"
                    returnKeyType="next"
                  />
                </View>

                <Text style={styles.label}>{t('contactLabel')}</Text>
                <View style={[styles.inputWrapper, errors.contact && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={contact}
                    onChangeText={(v) => {
                      if (v !== digitsOnly(v)) return; // Only allow numeric input
                      const digits = digitsOnly(v);
                      if (digits.length <= 10) {
                        setContact(digits);
                        clearErr('contact');
                      }
                    }}
                    placeholder={t('contactPlaceholder')}
                    placeholderTextColor="#9AA3AE"
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    maxLength={10}
                  />
                </View>
                {errors.contact && contact && (
                  <Text style={styles.errorText}>{getPhoneError(contact)}</Text>
                )}
              </>
            )}

            {/* Remember + Help (both modes) */}
            <View style={styles.rowBetween}>
              <Pressable
                style={styles.rememberRow}
                onPress={() => setRemember(r => !r)}
                hitSlop={10}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: remember }}
              >
                <Checkbox checked={remember} />
                <Text style={styles.rememberText}>{t('rememberMe')}</Text>
              </Pressable>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.helpLink}>{t('needHelp')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Pinned footer: language segmented + CTA */}
          <View
            style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
            onLayout={e => setFooterH(e.nativeEvent.layout.height)}
          >
            <Text style={styles.langTitle}>{t('chooseLanguage')}</Text>

            {/* language segmented control */}
            <View style={[styles.segment, styles.segmentLang]}>
              <TouchableOpacity
                style={[styles.segmentItem, lang === 'si' && styles.segmentItemActive]}
                onPress={() => setLang('si')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, lang === 'si' && styles.segmentTextActive]}>
                  {t('lang_si')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentItem, lang === 'ta' && styles.segmentItemActive]}
                onPress={() => setLang('ta')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, lang === 'ta' && styles.segmentTextActive]}>
                  {t('lang_ta')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentItem, lang === 'en' && styles.segmentItemActive]}
                onPress={() => setLang('en')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, lang === 'en' && styles.segmentTextActive]}>
                  {t('lang_en')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* CTA: Link for Sign Up → /otp (blocked on invalid), plain button for Log In */}
            {mode === 'signup' ? (
              <TouchableOpacity
                style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
                activeOpacity={0.9}
                disabled={isLoading}
                onPress={async () => {
                  if (otpMode) {
                    await handleVerifyOTP();
                  } else {
                    await validateSignup();
                  }
                }}
              >
                <Text style={styles.primaryBtnText}>
                  {isLoading ? 'Please wait...' : otpMode ? 'Verify OTP' : ctaLabel}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
                activeOpacity={0.9}
                disabled={isLoading}
                onPress={async () => {
                  if (otpMode) {
                    await handleVerifyOTP();
                  } else {
                    await validateLogin();
                  }
                }}
              >
                <Text style={styles.primaryBtnText}>
                  {isLoading ? 'Please wait...' : otpMode ? 'Verify OTP' : ctaLabel}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </LinearGradient>
  );
}

/* Reusable checkbox with green tick */
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkboxBase, checked && styles.checkboxBaseChecked]}>
      {checked ? <Feather name="check" size={14} color="#4A934A" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  topContainer: { flex: 1 },

  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    overflow: 'hidden',
  },
  sheetContent: { padding: 20 },

  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  subtitle: { marginTop: 6, textAlign: 'center', color: '#6B7280' },

  /* segmented (reused) */
  segment: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginTop: 18,
  },
  segmentLang: { marginTop: 10 },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: { fontWeight: '600', color: '#64748B' },
  segmentTextActive: { color: '#111827' },

  label: { marginTop: 16, marginBottom: 6, color: '#374151', fontWeight: '600' },

  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: { fontSize: 16, color: '#111827' },
  inputError: { borderColor: '#DC2626' }, // red border

  adultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  adultTitle: { fontWeight: '700', color: '#111827' },
  adultSub: { color: '#6B7280', marginTop: 2 },

  rowBetween: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },

  /* Checkbox visuals */
  checkboxBase: {
    width: 18, height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#4A934A',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBaseChecked: { backgroundColor: '#FFFFFF' },

  rememberText: { color: '#374151' },
  helpLink: { color: '#15803D', fontWeight: '700' },

  /* pinned footer */
  footer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  langTitle: { textAlign: 'center', color: '#6B7280', fontWeight: '600', marginBottom: 8 },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: '#4A934A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  errorText: { color: '#DC2626', fontSize: 12, marginTop: 4, marginLeft: 4 },

  // Date picker styles
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerDoneBtn: {
    backgroundColor: '#4A934A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  datePickerDoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

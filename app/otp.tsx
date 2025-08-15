// app/otp.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, ApiError } from '../services/api';

const heroImage = require('../assets/images/doctor-illustration.png');

type Lang = 'si' | 'ta' | 'en';
const T: Record<Lang, any> = {
  en: { title: (p: string) => `Enter the OTP sent to ${p}`, didnt: "didn't receive?", resend: 'Send Again', cta: 'Log in' },
  si: { title: (p: string) => `${p} වෙත එවූ OTP යොදන්න`, didnt: 'ලභ නැද්ද?', resend: 'නැවත යවන්න', cta: 'පිවිසෙන්න' },
  ta: { title: (p: string) => `${p} க்கு அனுப்பிய OTP ஐ உள்ளிடவும்`, didnt: 'பெறவில்லைவா?', resend: 'மீண்டும் அனுப்பு', cta: 'உள்நுழைக' },
};

const maskSriLankaPhone = (raw: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  const local = digits.startsWith('0') ? digits.slice(1) : digits;
  const first = local.slice(0, 1);
  const last2 = local.slice(-2);
  return `+94 ${first}*****${last2}`;
};

export default function OTP() {
  const { phone = '', userId = '', lang = 'en' } = useLocalSearchParams<{ phone?: string; userId?: string; lang?: Lang }>();
  const L: Lang = (['si', 'ta', 'en'] as const).includes(lang as Lang) ? (lang as Lang) : 'en';
  const insets = useSafeAreaInsets();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<Array<TextInput | null>>([]);

  // Focus first box on mount
  useEffect(() => {
    setTimeout(() => inputs.current[0]?.focus(), 150);
  }, []);

  // resend timer
  useEffect(() => {
    setSeconds(30);
    const id = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const focusIndex = (i: number) => inputs.current[i]?.focus();

  const handleChange = (index: number, value: string) => {
    // keep only the last numeric char (avoid spaces/letters)
    const char = (value.match(/\d/g) || []).pop() || '';
    const next = [...digits];
    next[index] = char;
    setDigits(next);

    if (char && index < 5) {
      // move to next on valid entry
      focusIndex(index + 1);
    }
  };

  const handleKey = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (digits[index]) {
        // clear current
        const next = [...digits];
        next[index] = '';
        setDigits(next);
        return;
      }
      // move back if current already empty
      if (index > 0) {
        focusIndex(index - 1);
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
      }
    }
  };

  const onResend = async () => {
    if (seconds > 0) return;
    try {
      setIsLoading(true);
      setError('');
      const response = await api.login(userId, phone);
      setSeconds(30);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await api.verifyOTP(userId, code);
      // Here you should save the token securely and navigate
      router.replace('/');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
      // Clear digits on error
      setDigits(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const code = digits.join('');
  const masked = maskSriLankaPhone(String(phone));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        {/* Top image */}
        <Image source={heroImage} style={styles.hero} resizeMode="cover" />

        {/* Spacer so the bottom block pins to bottom */}
        <View style={{ flex: 1 }} />

        {/* Bottom block — anchored and lifts above keyboard */}
        <View style={[styles.bottom, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
          <Text style={styles.title}>{T[L].title(masked)}</Text>

          <View style={styles.row}>
            <Text style={styles.muted}>{T[L].didnt} </Text>
            <Pressable onPress={onResend} disabled={seconds > 0} hitSlop={8}>
              <Text style={[styles.link, seconds > 0 && styles.linkDisabled]}>
                {T[L].resend}{seconds > 0 ? ` (${seconds}s)` : ''}
              </Text>
            </Pressable>
          </View>

          {/* 6 real inputs */}
          <Pressable
            style={styles.otpRow}
            onPress={() => {
              // focus first empty box on tap
              const firstEmpty = Math.max(0, digits.findIndex(d => !d));
              focusIndex(firstEmpty === -1 ? 5 : firstEmpty);
            }}
          >
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={el => (inputs.current[i] = el)}
                value={d}
                onChangeText={val => handleChange(i, val)}
                onKeyPress={e => handleKey(i, e)}
                keyboardType="number-pad"
                maxLength={1}
                returnKeyType={i === 5 ? 'done' : 'next'}
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                importantForAutofill="yes"
                style={styles.otpInput}
              />
            ))}
          </Pressable>

          {/* Error message */}
          {error ? (
            <Text style={[styles.muted, { color: '#DC2626', marginTop: 8 }]}>{error}</Text>
          ) : null}

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (isLoading || code.length < 6) && styles.primaryBtnDisabled
            ]}
            activeOpacity={0.9}
            disabled={isLoading || code.length < 6}
            onPress={verifyOTP}
          >
            <Text style={styles.primaryBtnText}>
              {isLoading ? 'Verifying...' : T[L].cta}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const RADIUS = 18;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  hero: {
    width: '92%',
    alignSelf: 'center',
    height: 320,
    borderRadius: RADIUS,
    marginTop: 8,
  },

  bottom: {
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    // Optional "sheet" styling:
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
    // shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: -6 }, elevation: 6,
  },

  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  muted: { color: '#6B7280' },
  link: { color: '#15803D', fontWeight: '700' },
  linkDisabled: { opacity: 0.5 },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 6,
  },
  otpInput: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  primaryBtn: {
    marginTop: 18,
    backgroundColor: '#4A934A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

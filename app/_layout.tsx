import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="book-appointment" options={{ title: "Book an Appointment", headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="otp" options={{ title: "OTP", headerShown: false }} />
    </Stack>
  );
}

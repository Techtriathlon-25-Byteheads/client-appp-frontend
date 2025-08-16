import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="bookAppointment" options={{ title: "Book an Appointment", headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="otp" options={{ title: "OTP", headerShown: false }} />
      <Stack.Screen name="aiChat" options={{ title: "AIChat", headerShown: false }} />
      <Stack.Screen name="appointments" options={{ title: "Appointments", headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
      <Stack.Screen name="bookConfirmation" options={{ title: "Booking Confirmation", headerShown: false }} />
    </Stack>
  );
}


// import { Stack, useRouter } from "expo-router";
// import { useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function RootLayout() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem("userToken");

//         if (!token) {
//           router.replace("/login");
//         } else {
//           router.replace("/"); 
//         }
//       } catch (err) {
//         console.log("Auth check error:", err);
//         router.replace("/login");
//       }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <Stack>
//       <Stack.Screen name="login" options={{ headerShown: false }} />
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="otp" options={{ headerShown: false }} />
//     </Stack>
//   );
// }
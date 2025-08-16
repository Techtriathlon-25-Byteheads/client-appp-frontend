import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          router.replace("/login"); // no token → login
        } else {
          router.replace("/"); // token exists → home
        }
      } catch (err) {
        console.log("Auth check error:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
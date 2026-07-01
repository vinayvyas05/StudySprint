// app/_layout.tsx

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { useAuthStore } from "@/store/auth.store";

// Ignore harmless Firebase Web SDK warnings in React Native
LogBox.ignoreLogs(["BloomFilter"]);

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    const unsubscribe = initializeAuth();

    return unsubscribe;
  }, []);
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}

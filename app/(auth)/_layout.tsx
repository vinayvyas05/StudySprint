import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function AuthLayout() {
  const { user, authLoading } = useAuthStore();

  if (authLoading) {
    return null;
  }

  if (user) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
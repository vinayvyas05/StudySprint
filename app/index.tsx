import { Text, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function Index() {
  const { user, authLoading } = useAuthStore();

  if (authLoading) return null;
  console.log({
    user,
    authLoading,
  });
  return user ? <Redirect href="/home" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

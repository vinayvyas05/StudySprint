import { Text, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import "../global.css";

export default function Index() {
  const { user, authLoading } = useAuthStore();

  if (authLoading) return null;
  console.log({
    user,
    authLoading,
  });
  return user ? <Redirect href="/sprint" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Text, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = true; // replace later

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

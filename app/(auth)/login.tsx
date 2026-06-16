// app/(auth)/login.tsx

import { View, StyleSheet } from "react-native";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
});
// app/(auth)/register.tsx

import { View, StyleSheet } from "react-native";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <RegisterForm />
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
// components/auth/LoginForm.tsx

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log({
      email,
      password,
    });

    // Firebase Login Logic Here

    // router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
      >
        <Text style={styles.link}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "600",
  },
});
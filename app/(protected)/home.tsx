import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { logoutUser } from "@/services/auth.service";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function home() {
  const logout = useAuthStore((state) => state.logout);
  const handleLogOut = async () => {
    try {
      await logout();
      console.log("logout");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Text>home</Text>
      </View>
      <TouchableOpacity onPress={handleLogOut}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

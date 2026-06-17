import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { logoutUser } from "@/services/auth.service";
import { router } from "expo-router";

export default function home() {
  const handleLogOut = async () => {
    try {
      await logoutUser();

      router.replace("/login");
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

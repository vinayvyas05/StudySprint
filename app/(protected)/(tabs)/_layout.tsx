import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Dimensions } from "react-native";
import { NavigationBar } from "expo-navigation-bar";

export default function TabsLayout() {
  return (
    <>
      {Platform.OS === "android" && <NavigationBar style="dark" />}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#52525B",
          tabBarStyle: {
            position: "absolute",
            bottom: Platform.OS === "ios" ? 32 : 32,

            left: 0,
            right: 0,

            width: "88%",
            marginHorizontal: "6%",
            alignSelf: "center",
            backgroundColor: "#000000",
            borderTopWidth: 0,
            borderRadius: 40,
            height: 68,
            paddingTop: Platform.OS === "ios" ? 20 : 8,
            paddingBottom: Platform.OS === "ios" ? 20 : 8,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="sprint"
          options={{
            title: "Sprint",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "timer" : "timer-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="battles"
          options={{
            title: "Battles",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "trophy" : "trophy-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

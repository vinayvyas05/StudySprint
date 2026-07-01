import { useEffect, useCallback, useRef } from "react";
import { ScrollView, StyleSheet, View, Text, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { useAuthStore } from "@/store/auth.store";
import { useProgressStore } from "@/store/progress.store";

import { LevelCard } from "../../../src/components/progress/LevelCard";
import { RecentSprints } from "../../../src/components/progress/RecentSprints";
import { StatsGrid } from "../../../src/components/progress/StatsGrid";

export default function ProgressScreen() {
  const user = useAuthStore((state) => state.user);
  const { stats, sessions, loadProgress } = useProgressStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  useEffect(() => {
    if (!user?.uid) return;
    loadProgress(user.uid);
  }, [user?.uid]);

  if (!stats) {
    return null;
  }

  return (
    <View style={styles.wrapper}>

      {/* Content */}
      <SafeAreaView style={styles.content}>
        <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
          <View className="px-6 pt-10 pb-6">
          <Text className="text-white text-3xl font-extrabold tracking-tight">
            Progress
          </Text>
          <Text className="text-neutral-400 text-[10px] tracking-widest uppercase mt-0.5 font-bold">
            {user?.name ? `${user.name.split(" ")[0]}'s Statistics` : "Your Statistics"}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <LevelCard xp={stats.xp} level={stats.level} />
          <StatsGrid stats={stats} />
          <RecentSprints sessions={sessions} />
        </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    zIndex: 10,
    position: "relative",
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 110,
    gap: 20,
  },
});

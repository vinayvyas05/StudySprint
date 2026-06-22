import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/auth.store";
import { useProgressStore } from "@/store/progress.store";

import { LevelCard } from "../../../src/components/progress/LevelCard";
import { RecentSprints } from "../../../src/components/progress/RecentSprints";
import { StatsGrid } from "../../../src/components/progress/StatsGrid";

// Star component
function Star({
  size,
  opacity,
  x,
  y,
}: {
  size: number;
  opacity: number;
  x: number;
  y: number;
}) {
  const blinkAnimation = useRef(new Animated.Value(1)).current;
  const randomDelay = useRef(Math.random() * 2000).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(randomDelay),
        Animated.timing(blinkAnimation, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.delay(Math.random() * 3000 + 2000),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [blinkAnimation, randomDelay]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          left: x,
          top: y,
          opacity: blinkAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [opacity * 0.3, opacity],
          }),
        },
      ]}
    />
  );
}

// Shooting Star component
function ShootingStar() {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.delay(3000),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [animationValue]);

  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, Dimensions.get("window").width + 100],
  });

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -400],
  });

  const opacity = animationValue.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.shootingStar,
        {
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    />
  );
}

export default function ProgressScreen() {
  const user = useAuthStore((state) => state.user);
  const { stats, sessions, loadProgress } = useProgressStore();
  const [stars, setStars] = useState<
    Array<{ id: number; size: number; opacity: number; x: number; y: number }>
  >([]);

  useEffect(() => {
    if (!user?.uid) return;
    loadProgress(user.uid);
  }, [user?.uid]);

  // Generate random stars
  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      x: Math.random() * width,
      y: Math.random() * height,
    }));
    setStars(generatedStars);
  }, []);

  if (!stats) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      {/* Galaxy Background */}
      <View style={styles.galaxyBackground} />

      {/* Stars Background Layer */}
      <View style={styles.starsContainer}>
        {stars.map((star) => (
          <Star
            key={star.id}
            size={star.size}
            opacity={star.opacity}
            x={star.x}
            y={star.y}
          />
        ))}
      </View>

      {/* Shooting Stars */}
      <View style={styles.shootingStarsContainer}>
        <ShootingStar />
        <ShootingStar />
      </View>

      {/* Content */}
      <SafeAreaView style={styles.content}>
        <ScrollView contentContainerStyle={styles.container}>
          <LevelCard xp={stats.xp} level={stats.level} />
          <StatsGrid stats={stats} />
          <RecentSprints sessions={sessions} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: "#0a0e27",
  },
  galaxyBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0e27",
    zIndex: 0,
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
  star: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 50,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  shootingStarsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
    overflow: "hidden",
  },
  shootingStar: {
    position: "absolute",
    width: 200,
    height: 2,
    backgroundColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ rotate: "45deg" }],
    top: "10%",
  },
  content: {
    flex: 1,
    zIndex: 10,
    position: "relative",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
  },
});

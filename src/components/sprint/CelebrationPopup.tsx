import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Animated, TouchableOpacity, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  xpGained: number;
  onClose: () => void;
}

export default function CelebrationPopup({ visible, xpGained, onClose }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Reset
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      pulseAnim.setValue(1);

      // Entrance animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing icon animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, scaleAnim, opacityAnim, pulseAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        className="flex-1 justify-center items-center px-6"
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          className="bg-[#161616] rounded-[32px] p-8 w-full items-center border border-white/[0.08]"
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Trophy Icon with Pulse */}
          <Animated.View
            className="w-20 h-20 rounded-full bg-white/[0.05] justify-center items-center mb-6"
            style={{ transform: [{ scale: pulseAnim }] }}
          >
            <Ionicons name="trophy" size={40} color="#FFFFFF" />
          </Animated.View>

          <Text className="text-white text-2xl font-extrabold mb-2 text-center tracking-tight">
            Sprint Completed!
          </Text>
          <Text className="text-[#A1A1AA] text-[15px] font-medium mb-8 text-center leading-relaxed">
            Excellent focus. You completed all 4 cycles and earned your bonus XP!
          </Text>

          <View className="bg-white/[0.05] rounded-2xl py-3 px-6 mb-8 flex-row items-center justify-center gap-2 border border-white/[0.05]">
            <Ionicons name="flash" size={18} color="#F59E0B" />
            <Text className="text-white text-xl font-bold tracking-tight">
              +{xpGained} XP
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="bg-white w-full py-4 rounded-[100px] items-center shadow-lg"
          >
            <Text className="text-black text-[16px] font-bold tracking-wide">
              Awesome
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

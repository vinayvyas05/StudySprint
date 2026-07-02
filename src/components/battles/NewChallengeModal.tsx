import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/types/user.types";
import { searchUsers, sendChallenge } from "@/services/battle.service";
import { BattleType } from "@/types/battle.types";
import { useAuthStore } from "@/store/auth.store";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
};

const BATTLE_TYPES: { id: BattleType; label: string; icon: any; disabled?: boolean }[] = [
  { id: "focus_time", label: "Focus Time", icon: "time-outline" },
  { id: "pomodoro", label: "Pomodoros", icon: "timer-outline", disabled: true },
  { id: "streak", label: "Daily Streak", icon: "flame-outline", disabled: true },
];

const DURATIONS = [30, 60, 120, 240];

export default function NewChallengeModal({ visible, onClose }: Props) {
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [opponent, setOpponent] = useState<UserProfile | null>(null);
  const [battleType, setBattleType] = useState<BattleType>("focus_time");
  const [duration, setDuration] = useState<number>(60);
  
  const [isSending, setIsSending] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (visible) {
      setStep(1);
      setSearchQuery("");
      setSearchResults([]);
      setOpponent(null);
      setBattleType("focus_time");
      setDuration(60);
      setIsSending(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        // Filter out self
        setSearchResults(results.filter(u => u.uid !== user?.uid));
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  const handleSendChallenge = async () => {
    if (!user || !opponent) return;
    setIsSending(true);
    try {
      await sendChallenge(user.uid, user.name, {
        type: battleType,
        targetValue: duration,
        opponentId: opponent.uid,
        opponentName: opponent.name,
      });
      onClose();
    } catch (err) {
      console.error("Failed to send challenge:", err);
    } finally {
      setIsSending(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
          className="justify-end"
        >
          <View
            className="rounded-t-[36px] px-8 pt-4 border-t border-white/[0.06]"
            style={{ backgroundColor: "#121212", maxHeight: SCREEN_HEIGHT * 0.78, minHeight: SCREEN_HEIGHT * 0.6 }}
          >
            {/* Drag handle */}
            <View {...panResponder.panHandlers} className="items-center pb-5 pt-2 w-full">
              <View className="w-12 h-1.5 rounded-full bg-white/[0.2]" />
            </View>

            {/* Header */}
            <View className="flex-row justify-center items-center mb-8">
              <Text className="text-white text-[22px] font-extrabold tracking-tight">
                {step === 1 ? "Find Opponent" : step === 2 ? "Battle Type" : "Set Goal"}
              </Text>
            </View>

            <View className="flex-1">
              {step === 1 && (
                <View className="flex-1">
                  <View className="flex-row items-center gap-3 mb-6 relative">
                    <TextInput
                      className="flex-1 bg-[#1A1A1C] border border-white/[0.07] rounded-[20px] text-white text-[16px] font-semibold px-5 py-4"
                      placeholder="Search by name or email..."
                      placeholderTextColor="#52525B"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <View className="absolute right-5">
                      {isSearching ? (
                        <ActivityIndicator size="small" color="#52525B" />
                      ) : (
                        <Ionicons name="search" size={20} color="#52525B" />
                      )}
                    </View>
                  </View>

                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.uid}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      searchQuery && !isSearching ? (
                        <Text className="text-[#71717A] text-center mt-4">No users found.</Text>
                      ) : null
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setOpponent(item);
                          setStep(2);
                        }}
                        className="bg-[#1A1A1C] border border-white/[0.05] rounded-3xl p-5 mb-3 flex-row items-center justify-between"
                        activeOpacity={0.7}
                      >
                        <View>
                          <Text className="text-white font-bold text-lg">{item.name}</Text>
                          <Text className="text-[#71717A] text-xs mt-1">Lvl {item.level} • {item.totalFocusMinutes}m focused</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#52525B" />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {step === 2 && (
                <View className="flex-1">
                  {BATTLE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      onPress={() => {
                        if (!type.disabled) {
                          setBattleType(type.id);
                          setStep(3);
                        }
                      }}
                      disabled={type.disabled}
                      className={`border rounded-3xl p-6 mb-4 flex-row items-center gap-4 ${
                        type.disabled ? "bg-white/[0.02] border-transparent opacity-50" : "bg-[#1A1A1C] border-white/[0.05]"
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="w-12 h-12 rounded-full bg-white/5 items-center justify-center">
                        <Ionicons name={type.icon} size={24} color="#FFF" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-lg">{type.label}</Text>
                        {type.disabled && <Text className="text-[#71717A] text-xs mt-1">Coming soon</Text>}
                      </View>
                      {!type.disabled && <Ionicons name="chevron-forward" size={20} color="#52525B" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {step === 3 && (
                <View className="flex-1">
                  <Text className="text-[#71717A] text-[13px] font-medium mb-6 text-center">
                    First person to reach this focus time wins the battle against {opponent?.name}.
                  </Text>
                  
                  <View className="flex-row flex-wrap justify-between gap-y-4">
                    {DURATIONS.map((dur) => (
                      <TouchableOpacity
                        key={dur}
                        onPress={() => setDuration(dur)}
                        className={`w-[48%] py-4 rounded-3xl border items-center justify-center ${
                          duration === dur ? "bg-white border-white" : "bg-[#1A1A1C] border-white/[0.05]"
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text className={`font-extrabold text-xl ${duration === dur ? "text-black" : "text-white"}`}>
                          {dur}m
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between gap-4 pt-6 pb-12 mt-auto">
              {step > 1 && (
                <TouchableOpacity
                  onPress={() => setStep(step - 1)}
                  className="w-[56px] h-[56px] rounded-full bg-white/[0.06] items-center justify-center border border-white/[0.07]"
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="#E4E4E7" />
                </TouchableOpacity>
              )}

              {step === 3 && (
                <TouchableOpacity
                  onPress={handleSendChallenge}
                  disabled={isSending}
                  className="flex-1 flex-row items-center justify-center gap-2 bg-white h-[56px] rounded-full"
                  activeOpacity={0.85}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <>
                      <Ionicons name="send" size={18} color="#000" />
                      <Text className="text-black text-[16px] font-extrabold tracking-tight">
                        Send Challenge
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  getGroupById,
  getGroupMembersWithProfiles,
  subscribeToGroupFocusingUsers,
} from "@/services/group.service";
import type { Group } from "@/types/group.types";
import type { UserProfile } from "@/types/user.types";

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [focusingUserIds, setFocusingUserIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    let unsubscribe: (() => void) | undefined;

    const loadData = async () => {
      setLoading(true);
      try {
        const [groupData, membersData] = await Promise.all([
          getGroupById(id),
          getGroupMembersWithProfiles(id),
        ]);
        setGroup(groupData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to load group details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    unsubscribe = subscribeToGroupFocusingUsers(id, (focusing) => {
      setFocusingUserIds(focusing);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aFocusing = focusingUserIds.has(a.uid) ? 1 : 0;
      const bFocusing = focusingUserIds.has(b.uid) ? 1 : 0;
      return bFocusing - aFocusing;
    });
  }, [members, focusingUserIds]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-white">Group not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-[#4ADE80]">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Top 30% Header Area */}
      <View style={{ flex: 0.3 }} className="pt-16 px-6 justify-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-16 left-6 z-10 w-10 h-10 bg-white/[0.05] rounded-full items-center justify-center border border-white/[0.1]"
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        
        <View className="items-center mt-6">
          <Text className="text-white text-3xl font-bold tracking-tight text-center mb-1">
            {group.name}
          </Text>
          <Text className="text-[#A1A1AA] text-sm font-medium mb-4">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Text>
          
          <Text className="text-[#D4D4D8] text-sm text-center px-4 mb-6" numberOfLines={1}>
            {group.description || "A focus group for dedicated individuals."}
          </Text>

          <TouchableOpacity 
            className="bg-white px-8 py-3 rounded-full flex-row items-center gap-2 shadow-lg"
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={18} color="#000" />
            <Text className="text-black font-bold text-[15px]">Invite Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom 70% List Area */}
      <View style={{ flex: 0.7 }} className="bg-[#161616] rounded-t-[40px] px-6 pt-8">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-xl font-bold">Members</Text>
          <Text className="text-[#A1A1AA] text-sm">{focusingUserIds.size} focusing</Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <FlashList
            data={sortedMembers}
            // @ts-expect-error: FlashList types might be missing in this environment
            estimatedItemSize={70}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isFocusing = focusingUserIds.has(item.uid);
              return (
                <View className="flex-row items-center justify-between mb-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04]">
                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-full bg-white/[0.05] items-center justify-center border border-white/[0.1]">
                      <Text className="text-white font-bold text-lg">{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text className="text-white text-[15px] font-bold">{item.name}</Text>
                      <Text className="text-[#A1A1AA] text-xs mt-1">Level {item.level || 1} • {item.xp || 0} XP</Text>
                    </View>
                  </View>
                  
                  {isFocusing ? (
                    <View className="flex-row items-center gap-1.5 bg-[#4ADE80]/10 px-3 py-1.5 rounded-full border border-[#4ADE80]/20">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                      <Text className="text-[#4ADE80] text-[11px] font-bold tracking-wide uppercase">Focusing</Text>
                    </View>
                  ) : (
                    <View className="px-3 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02]">
                      <Text className="text-[#52525B] text-[11px] font-bold tracking-wide uppercase">Offline</Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

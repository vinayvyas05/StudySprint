import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CreateGroupModal from "@/components/community/CreateGroupModal";
import EmptyState from "@/components/community/EmptyState";
import {
  JoinedGroupRow,
  SuggestedGroupRow,
} from "@/components/community/GroupCard";
import { useCommunity } from "@/hooks/useCommunity";
import type { Group } from "@/types/group.types";

export default function CommunityScreen() {
  const router = useRouter();
  const {
    groups,
    joinedGroupIds,
    categories,
    focusingCounts,
    loading,
    actionLoading,
    error,
    userId,
    refresh,
    join,
    leave,
    create,
    remove,
  } = useCommunity();

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

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Split groups into joined vs suggested ─────────────────
  const { joinedGroups, suggestedGroups } = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = query
      ? groups.filter(
          (g) =>
            g.name.toLowerCase().includes(query) ||
            g.description.toLowerCase().includes(query) ||
            g.category?.toLowerCase().includes(query)
        )
      : groups;

    return {
      joinedGroups: filtered.filter((g) => joinedGroupIds.has(g.id)),
      suggestedGroups: filtered.filter((g) => !joinedGroupIds.has(g.id)),
    };
  }, [groups, joinedGroupIds, search]);

  // ─── Community-wide stats ──────────────────────────────────
  const totalMembers = useMemo(
    () => groups.reduce((sum, g) => sum + g.memberCount, 0),
    [groups]
  );
  const totalFocusing = useMemo(
    () => Object.values(focusingCounts).reduce((sum, c) => sum + c, 0),
    [focusingCounts]
  );

  // ─── Pull-to-refresh ───────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // ─── Delete confirm ────────────────────────────────────────
  const confirmDelete = useCallback(
    (group: Group) => {
      Alert.alert(
        "Delete Study Hall",
        `Delete "${group.name}"? This will remove all members.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => remove(group.id),
          },
        ]
      );
    },
    [remove]
  );

  // ─── Leave confirm ─────────────────────────────────────────
  const confirmLeave = useCallback(
    (group: Group) => {
      Alert.alert("Leave Study Hall", `Leave "${group.name}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => leave(group.id),
        },
      ]);
    },
    [leave]
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <View style={{ flex: 1, backgroundColor: "#121212" }}>
        <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        {/* ── Page Header ── */}
        <View className="flex-row items-center justify-between px-6 pt-10 pb-6">
          <Text className="text-white text-xl font-bold tracking-tight">
            Focus Groups
          </Text>
          <TouchableOpacity
            className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06]"
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#A1A1AA" />
            <Text className="text-[#A1A1AA] text-[14px] font-medium">Help</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View className="flex-row items-center bg-[#161616] rounded-2xl mx-6 px-4 py-3 gap-3 mb-6">
          <Ionicons name="search" size={18} color="#52525B" />
          <TextInput
            className="flex-1 text-white text-[15px]"
            placeholder="Search groups..."
            placeholderTextColor="#52525B"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.6}>
              <Ionicons name="close-circle" size={18} color="#52525B" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Error Banner ── */}
        {error && (
          <View className="flex-row items-center gap-2 mx-6 mb-4 px-4 py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/15">
            <Ionicons name="alert-circle" size={14} color="#EF4444" />
            <Text className="text-red-300 text-xs font-medium flex-1">
              {error}
            </Text>
          </View>
        )}

        {/* ── Loading ── */}
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color="#94A3B8" />
            <Text className="text-slate-500 text-[13px]">
              Loading study halls...
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 110 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#94A3B8"
                colors={["#94A3B8"]}
                progressBackgroundColor="#121212"
              />
            }
          >
            {/* ── YOUR HALLS section ── */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-[18px] font-bold">
                  Your groups
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text className="text-[#4ADE80] text-[15px] font-medium">
                    + Create Group
                  </Text>
                </TouchableOpacity>
              </View>

              {joinedGroups.length === 0 ? (
                <View className="bg-[#161616] rounded-[24px] overflow-hidden">
                  <EmptyState
                    message={
                      search
                        ? "No joined groups match your search"
                        : "You haven't joined any groups yet"
                    }
                    icon="people-outline"
                  />
                </View>
              ) : (
                <View>
                  {joinedGroups.map((group, index) => (
                    <JoinedGroupRow
                      key={group.id}
                      name={group.name}
                      category={group.category ?? ""}
                      memberCount={group.memberCount}
                      focusingCount={focusingCounts[group.id] ?? 0}
                      isOwner={group.createdBy === userId}
                      isLoading={actionLoading === group.id}
                      isLast={index === joinedGroups.length - 1}
                      onPress={() => router.push(`/(protected)/group/${group.id}` as any)}
                      onLeave={() => confirmLeave(group)}
                      onDelete={() => confirmDelete(group)}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* ── DISCOVER section ── */}
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-[18px] font-bold">
                  Suggested groups
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#4ADE80] text-[15px] font-medium">
                    View all
                  </Text>
                </TouchableOpacity>
              </View>

              {suggestedGroups.length === 0 ? (
                <View className="bg-[#161616] rounded-[24px] overflow-hidden">
                  <EmptyState
                    message={
                      search
                        ? "No groups match your search"
                        : "All groups have been joined — create a new one!"
                    }
                    icon={search ? "search-outline" : "telescope-outline"}
                  />
                </View>
              ) : (
                <View>
                  {suggestedGroups.map((group, index) => (
                    <SuggestedGroupRow
                      key={group.id}
                      name={group.name}
                      category={group.category ?? ""}
                      memberCount={group.memberCount}
                      focusingCount={focusingCounts[group.id] ?? 0}
                      isLoading={actionLoading === group.id}
                      isLast={index === suggestedGroups.length - 1}
                      onJoin={() => join(group.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        )}
        </Animated.View>
      </View>

      {/* ── Create Group Modal ── */}
      <CreateGroupModal
        visible={modalVisible}
        existingCategories={categories}
        onClose={() => setModalVisible(false)}
        onCreate={create}
        isLoading={actionLoading === "creating"}
      />
    </SafeAreaView>
  );
}

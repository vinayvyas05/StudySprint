import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0e27" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e27" />

      <View style={{ flex: 1, backgroundColor: "#0a0e27" }}>
        {/* ── Page Header ── */}
        <View className="flex-row items-center justify-between px-6 pt-2 pb-5">
          <Text className="text-white text-2xl font-extrabold tracking-tight">
            Study Halls
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10"
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color="#94A3B8" />
            <Text className="text-slate-300 text-[13px] font-bold">
              Create
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View className="flex-row items-center bg-white/[0.04] border border-white/[0.06] rounded-2xl mx-6 px-4 py-2.5 gap-3 mb-5">
          <Ionicons name="search" size={15} color="#475569" />
          <TextInput
            className="flex-1 text-slate-100 text-sm"
            placeholder="Search study halls..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.6}>
              <Ionicons name="close-circle" size={15} color="#475569" />
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
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#94A3B8"
                colors={["#94A3B8"]}
                progressBackgroundColor="#0a0e27"
              />
            }
          >
            {/* ── YOUR HALLS section ── */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-[17px] font-bold">
                  Your Halls
                </Text>
                <Text className="text-slate-500 text-[12px] font-medium">
                  {joinedGroups.length} joined
                </Text>
              </View>

              {joinedGroups.length === 0 ? (
                <View className="bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
                  <EmptyState
                    message={
                      search
                        ? "No joined halls match your search"
                        : "You haven't joined any study halls yet"
                    }
                    icon="people-outline"
                  />
                </View>
              ) : (
                <View className="bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
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
                      onLeave={() => confirmLeave(group)}
                      onDelete={() => confirmDelete(group)}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* ── DISCOVER section ── */}
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-[17px] font-bold">
                  Discover
                </Text>
                <Text className="text-slate-500 text-[12px] font-medium">
                  {suggestedGroups.length}{" "}
                  {suggestedGroups.length === 1 ? "hall" : "halls"}
                </Text>
              </View>

              {suggestedGroups.length === 0 ? (
                <View className="bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
                  <EmptyState
                    message={
                      search
                        ? "No halls match your search"
                        : "All halls have been joined — create a new one!"
                    }
                    icon={search ? "search-outline" : "telescope-outline"}
                  />
                </View>
              ) : (
                <View className="bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
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

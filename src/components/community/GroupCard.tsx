import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

// ─── Joined group row (inside "Your Halls" section card) ─────
type JoinedRowProps = {
  name: string;
  category: string;
  memberCount: number;
  isOwner: boolean;
  isLoading: boolean;
  onLeave: () => void;
  onDelete: () => void;
  isLast: boolean;
};

export function JoinedGroupRow({
  name,
  category,
  memberCount,
  isOwner,
  isLoading,
  onLeave,
  onDelete,
  isLast,
}: JoinedRowProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3.5 ${
        isLast ? "" : "border-b border-white/[0.04]"
      }`}
    >
      {/* Text */}
      <View className="flex-1">
        <Text className="text-slate-100 text-[15px] font-semibold" numberOfLines={1}>
          {name}
        </Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          {category ? (
            <Text className="text-indigo-400 text-[11px] font-semibold">
              {category}
            </Text>
          ) : null}
          <Text className="text-slate-600 text-[11px]">·</Text>
          <Text className="text-slate-500 text-[11px]">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Text>
        </View>
      </View>

      {/* Actions */}
      {isLoading ? (
        <ActivityIndicator size="small" color="#64748B" />
      ) : (
        <View className="flex-row items-center gap-2">
          {isOwner && (
            <TouchableOpacity
              onPress={onDelete}
              className="w-8 h-8 rounded-lg bg-red-500/10 items-center justify-center"
              activeOpacity={0.6}
            >
              <Ionicons name="trash-outline" size={14} color="#EF4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onLeave}
            className="w-8 h-8 rounded-lg bg-white/[0.05] items-center justify-center"
            activeOpacity={0.6}
          >
            <Ionicons name="exit-outline" size={15} color="#64748B" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Suggested group row (inside "Discover" section card) ─────
type SuggestedRowProps = {
  name: string;
  category: string;
  memberCount: number;
  isLoading: boolean;
  onJoin: () => void;
  isLast: boolean;
};

export function SuggestedGroupRow({
  name,
  category,
  memberCount,
  isLoading,
  onJoin,
  isLast,
}: SuggestedRowProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3.5 ${
        isLast ? "" : "border-b border-white/[0.04]"
      }`}
    >
      {/* Text */}
      <View className="flex-1">
        <Text className="text-slate-100 text-[15px] font-semibold" numberOfLines={1}>
          {name}
        </Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          {category ? (
            <Text className="text-indigo-400 text-[11px] font-semibold">
              {category}
            </Text>
          ) : null}
          <Text className="text-slate-600 text-[11px]">·</Text>
          <Text className="text-slate-500 text-[11px]">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Text>
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity
        onPress={onJoin}
        className="px-4 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25"
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#818CF8" />
        ) : (
          <Text className="text-indigo-300 text-[13px] font-bold">Join</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
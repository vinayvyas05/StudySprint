import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

// ─── Joined group row (inside "Your Halls" section card) ─────
type JoinedRowProps = {
  name: string;
  category: string;
  memberCount: number;
  focusingCount: number;
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
  focusingCount,
  isOwner,
  isLoading,
  onLeave,
  onDelete,
  isLast,
}: JoinedRowProps) {
  console.log("focsingCount", focusingCount);
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
            <Text className="text-slate-400 text-[11px] font-semibold">
              {category}
            </Text>
          ) : null}
          <Text className="text-slate-600 text-[11px]">·</Text>
          <Text className="text-slate-500 text-[11px]">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Text>
          {focusingCount > 0 && (
            <>
              <Text className="text-slate-600 text-[11px]">·</Text>
              <View className="flex-row items-center gap-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <Text className="text-emerald-400 text-[11px] font-semibold">
                  {focusingCount} focusing
                  
                </Text>
              </View>
            </>
          )}
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
  focusingCount: number;
  isLoading: boolean;
  onJoin: () => void;
  isLast: boolean;
};

export function SuggestedGroupRow({
  name,
  category,
  memberCount,
  focusingCount,
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
          {focusingCount > 0 && (
            <>
              <Text className="text-slate-600 text-[11px]">·</Text>
              <View className="flex-row items-center gap-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <Text className="text-emerald-400 text-[11px] font-semibold">
                  {focusingCount} focusing
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity
        onPress={onJoin}
        className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10"
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#94A3B8" />
        ) : (
          <Text className="text-slate-300 text-[13px] font-bold">Join</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

// ─── Joined group row (inside "Your groups" section) ─────
type JoinedRowProps = {
  name: string;
  category: string;
  memberCount: number;
  focusingCount: number;
  isOwner: boolean;
  isLoading: boolean;
  onLeave: () => void;
  onDelete: () => void;
  onPress: () => void;
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
  onPress,
}: JoinedRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={isOwner ? onDelete : onLeave}
      className="bg-[#161616] rounded-[24px] p-5 mb-4 w-full"
    >
      <View className="flex-row items-center justify-between mb-4">
        {/* Left side: Icon + Title/Members */}
        <View className="flex-row items-center gap-4 flex-1">
           {/* Big Icon Placeholder */}
           <View className="w-14 h-14 rounded-full bg-white/[0.06] items-center justify-center">
             <Ionicons name="hourglass" size={24} color="#FFFFFF" />
           </View>
           <View className="flex-1 pr-4">
             <Text className="text-white text-[17px] font-bold" numberOfLines={1}>{name}</Text>
             <Text className="text-[#A1A1AA] text-[13px] mt-0.5 font-medium">{memberCount} members</Text>
           </View>
        </View>
        {/* Right side: Icons */}
        <View className="flex-row items-center gap-3">
          <Ionicons name="pin" size={20} color="#52525B" />
          <Ionicons name="chevron-forward" size={20} color="#52525B" />
        </View>
      </View>
      
      {/* Bottom: Focusing */}
      <View className="flex-row items-center justify-center gap-2 border-t border-white/[0.04] pt-4">
         <View className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
         <Text className="text-white text-[13px] font-medium">{focusingCount} focusing now</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Suggested group row (inside "Suggested groups" section) ─────
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
  isLoading,
  onJoin,
}: SuggestedRowProps) {
  return (
    <View className="bg-[#161616] rounded-[24px] p-5 mb-4 w-full flex-row items-center justify-between">
      <View className="flex-row items-center gap-4 flex-1 pr-4">
        <View className="w-14 h-14 rounded-full bg-white/[0.06] items-center justify-center">
           <Ionicons name="school" size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1">
           <Text className="text-white text-[16px] font-bold" numberOfLines={1}>{name}</Text>
           <Text className="text-[#A1A1AA] text-[13px] mt-0.5 font-medium">{memberCount} members</Text>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={onJoin}
        disabled={isLoading}
        activeOpacity={0.8}
        className="bg-white px-6 py-2.5 rounded-full items-center justify-center min-w-[70px]"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-black font-bold text-[14px]">Join</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
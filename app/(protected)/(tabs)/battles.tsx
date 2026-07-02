import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { useBattles } from "@/hooks/useBattles";
import { acceptChallenge, declineChallenge } from "@/services/battle.service";
import NewChallengeModal from "@/components/battles/NewChallengeModal";

export default function BattlesScreen() {
  const user = useAuthStore((state) => state.user);
  const { activeBattles, pendingBattles, loading } = useBattles(user?.uid);

  // Modal State will go here later
  const [modalVisible, setModalVisible] = useState(false);

  const pendingReceived = pendingBattles.filter(b => b.opponentId === user?.uid);
  const pendingSent = pendingBattles.filter(b => b.challengerId === user?.uid);

  const handleAccept = async (id: string) => {
    await acceptChallenge(id);
  };
  
  const handleDecline = async (id: string) => {
    await declineChallenge(id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-3xl font-extrabold tracking-tight">Battles</Text>
          <Text className="text-neutral-400 text-[10px] tracking-widest uppercase mt-0.5 font-bold">
            Compete & Focus
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-white px-4 py-2 rounded-full flex-row items-center gap-2"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#000" />
          <Text className="text-black text-sm font-extrabold tracking-tight">Challenge</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
          
          {/* Pending Received */}
          {pendingReceived.length > 0 && (
             <View className="mb-8">
               <Text className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider mb-4 pl-2">Pending Requests</Text>
               {pendingReceived.map(battle => (
                 <View key={battle.id} className="bg-[#1A1A1C] border border-white/[0.05] rounded-[32px] p-6 mb-4">
                   <View className="flex-row items-center justify-between mb-5">
                     <View>
                       <Text className="text-white font-bold text-xl tracking-tight">{battle.challengerName}</Text>
                       <Text className="text-[#71717A] text-sm mt-0.5">Challenged you to {battle.type.replace('_', ' ')}</Text>
                     </View>
                     <View className="bg-white/10 px-4 py-1.5 rounded-full">
                        <Text className="text-white text-xs font-bold">{battle.targetValue}m</Text>
                     </View>
                   </View>
                   <View className="flex-row items-center gap-3">
                     <TouchableOpacity 
                       onPress={() => handleAccept(battle.id)} 
                       className="flex-1 bg-white py-3.5 rounded-2xl items-center"
                       activeOpacity={0.8}
                     >
                       <Text className="text-black font-extrabold tracking-tight">Accept</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                       onPress={() => handleDecline(battle.id)} 
                       className="flex-1 bg-white/10 py-3.5 rounded-2xl items-center border border-white/10"
                       activeOpacity={0.8}
                     >
                       <Text className="text-white font-extrabold tracking-tight">Decline</Text>
                     </TouchableOpacity>
                   </View>
                 </View>
               ))}
             </View>
          )}

          {/* Pending Sent */}
          {pendingSent.length > 0 && (
             <View className="mb-8">
               <Text className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider mb-4 pl-2">Awaiting Response</Text>
               {pendingSent.map(battle => (
                 <View key={battle.id} className="bg-[#1A1A1C] border border-white/[0.05] rounded-[24px] p-5 mb-4 flex-row items-center justify-between">
                   <View>
                     <Text className="text-white font-bold text-lg tracking-tight">{battle.opponentName}</Text>
                     <Text className="text-[#71717A] text-sm mt-0.5 capitalize">Sent {battle.type.replace('_', ' ')}</Text>
                   </View>
                   <View className="bg-yellow-500/10 px-3 py-1.5 rounded-full">
                     <Text className="text-yellow-500 text-xs font-bold">Pending</Text>
                   </View>
                 </View>
               ))}
             </View>
          )}

          {/* Active Battles */}
          <Text className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider mb-4 mt-2 pl-2">Active Battles</Text>
          {activeBattles.length === 0 ? (
            <View className="bg-[#1A1A1C] rounded-[36px] p-8 items-center border border-white/[0.05] mt-2">
              <View className="w-16 h-16 rounded-full bg-white/[0.03] items-center justify-center mb-4">
                <Ionicons name="trophy-outline" size={28} color="#52525B" />
              </View>
              <Text className="text-white text-lg font-bold mb-2 tracking-tight">No Active Battles</Text>
              <Text className="text-[#71717A] text-center text-sm font-medium px-4">
                Challenge a friend to a focus sprint and track your progress here.
              </Text>
            </View>
          ) : (
            activeBattles.map(battle => {
              const isChallenger = battle.challengerId === user?.uid;
              const myProgress = isChallenger ? battle.challengerProgress : battle.opponentProgress;
              const theirProgress = isChallenger ? battle.opponentProgress : battle.challengerProgress;
              const opponentName = isChallenger ? battle.opponentName : battle.challengerName;
              
              const myPercentage = Math.min((myProgress / battle.targetValue) * 100, 100);
              const theirPercentage = Math.min((theirProgress / battle.targetValue) * 100, 100);

              return (
                <View key={battle.id} className="bg-[#1A1A1C] border border-white/[0.05] rounded-[32px] p-6 mb-5">
                  <View className="flex-row items-center justify-between mb-8">
                    <View>
                      <Text className="text-white font-extrabold text-2xl tracking-tight mb-1">{opponentName}</Text>
                      <Text className="text-[#71717A] text-sm font-medium capitalize">{battle.type.replace('_', ' ')} Battle</Text>
                    </View>
                    <View className="bg-white/10 px-4 py-2 rounded-full">
                      <Text className="text-white text-[11px] font-extrabold tracking-wide uppercase">Goal: {battle.targetValue}m</Text>
                    </View>
                  </View>

                  {/* Progress Bars */}
                  <View className="gap-6">
                    {/* You */}
                    <View>
                      <View className="flex-row justify-between mb-3 pl-1 pr-1">
                        <Text className="text-white font-bold text-[13px] tracking-tight">You</Text>
                        <Text className="text-white font-bold text-[13px] tracking-tight">{myProgress} <Text className="text-[#71717A]">/ {battle.targetValue}m</Text></Text>
                      </View>
                      <View className="h-3.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <View className="h-full bg-white rounded-full" style={{ width: `${myPercentage}%` }} />
                      </View>
                    </View>
                    
                    {/* Opponent */}
                    <View>
                      <View className="flex-row justify-between mb-3 pl-1 pr-1">
                        <Text className="text-white font-bold text-[13px] tracking-tight">{opponentName}</Text>
                        <Text className="text-white font-bold text-[13px] tracking-tight">{theirProgress} <Text className="text-[#71717A]">/ {battle.targetValue}m</Text></Text>
                      </View>
                      <View className="h-3.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <View className="h-full bg-[#52525B] rounded-full" style={{ width: `${theirPercentage}%` }} />
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          )}

        </ScrollView>
      )}

      {/* ── New Challenge Modal ── */}
      <NewChallengeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

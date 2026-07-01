import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  selected: number;
  setSelected: (value: number) => void;
  disabled?: boolean;
  phaseColor: string;
};

export default React.memo(function SessionSelector({
  selected,
  setSelected,
  disabled,
  phaseColor,
}: Props) {
  const options = [
    { time: 25, label: "25" },
    { time: 50, label: "50" },
    { time: 90, label: "90" },
  ];

  return (
    <View className="py-2 w-full">
      <Text className="text-[9px] font-bold tracking-widest text-slate-500 uppercase text-center mb-3">
        Session Duration
      </Text>

      <View className="flex-row gap-3 justify-center px-4">
        {options.map((opt) => {
          const isActive = selected === opt.time;
          return (
            <TouchableOpacity
              key={opt.time}
              disabled={disabled}
              onPress={() => setSelected(opt.time)}
              activeOpacity={0.8}
              className="flex-1 max-w-[80px]"
            >
              <View
                className={`items-center justify-center py-2.5 rounded-2xl border transition-all duration-200 ${
                  disabled ? "opacity-30" : ""
                }`}
                style={{
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  borderColor: isActive ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  borderWidth: 1,
                }}
              >
                <Text
                  className="text-base font-bold tracking-tight"
                  style={{ color: isActive ? "#FFFFFF" : "#64748B" }}
                >
                  {opt.label}
                </Text>
                <Text
                  className="text-[8px] font-bold tracking-widest uppercase mt-0.5"
                  style={{ color: isActive ? "#94A3B8" : "#475569" }}
                >
                  MIN
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Custom Option */}
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.8}
          className="flex-1 max-w-[80px]"
        >
          <View
            className={`items-center justify-center py-2.5 rounded-2xl border border-dashed border-white/10 bg-transparent ${
              disabled ? "opacity-30" : ""
            }`}
          >
            <Text className="text-base font-semibold text-slate-400">＋</Text>
            <Text className="text-[8px] font-bold tracking-widest uppercase text-slate-500 mt-0.5">
              CUSTOM
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});


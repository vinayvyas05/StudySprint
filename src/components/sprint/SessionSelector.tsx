import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  selected: number;
  setSelected: (value: number) => void;
  disabled?: boolean;
  phaseColor: string;
};

export default function SessionSelector({
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
      <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase text-center mb-4">
        Session Duration (Minutes)
      </Text>

      <View className="flex-row gap-3 justify-between">
        {options.map((opt) => {
          const isActive = selected === opt.time;
          return (
            <TouchableOpacity
              key={opt.time}
              disabled={disabled}
              onPress={() => setSelected(opt.time)}
              activeOpacity={0.8}
              className="flex-1"
            >
              <View
                className={`items-center justify-center py-4 rounded-2xl border transition-all duration-200 ${
                  disabled ? "opacity-40" : ""
                }`}
                style={{
                  backgroundColor: isActive ? `${phaseColor}15` : "rgba(255, 255, 255, 0.03)",
                  borderColor: isActive ? phaseColor : "rgba(255, 255, 255, 0.08)",
                  borderWidth: isActive ? 1.5 : 1,
                  shadowColor: isActive ? phaseColor : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: isActive ? 3 : 0,
                }}
              >
                <Text
                  className="text-lg font-bold tracking-tight"
                  style={{ color: isActive ? "#FFFFFF" : "#94A3B8" }}
                >
                  {opt.label}
                </Text>
                <Text
                  className="text-[9px] font-bold tracking-wider uppercase mt-0.5"
                  style={{ color: isActive ? phaseColor : "#64748B" }}
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
          className="flex-1"
        >
          <View
            className={`items-center justify-center py-4 rounded-2xl border border-dashed border-white/10 bg-transparent ${
              disabled ? "opacity-40" : ""
            }`}
          >
            <Text className="text-lg font-semibold text-slate-400">＋</Text>
            <Text className="text-[9px] font-bold tracking-wider uppercase text-slate-500 mt-0.5">
              CUSTOM
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}


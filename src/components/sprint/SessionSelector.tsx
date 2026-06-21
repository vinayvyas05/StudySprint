import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Surface } from "react-native-paper";

const ACCENT = "#6366F1";
const ACCENT_SOFT = "#EEF2FF";
const BORDER = "#E2E8F0";
const TEXT_MAIN = "#0F172A";
const TEXT_MUTED = "#64748B";

type Props = {
  selected: number;
  setSelected: (value: number) => void;
  disabled?: boolean;
};

export default function SessionSelector({
  selected,
  setSelected,
  disabled,
}: Props) {
  const options = [
    { time: 25, label: "25" },
    { time: 50, label: "50" },
    { time: 90, label: "90" },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Session Length</Text>

      <View style={styles.row}>
        {options.map((opt) => {
          const isActive = selected === opt.time;
          return (
            <TouchableOpacity
              key={opt.time}
              disabled={disabled}
              onPress={() => setSelected(opt.time)}
              activeOpacity={0.75}
              style={{ flex: 1 }}
            >
              <Surface
                style={[
                  styles.chip,
                  isActive && styles.chipActive,
                  disabled && styles.chipDisabled,
                ]}
                elevation={isActive ? 2 : 0}
              >
                <Text
                  style={[styles.chipValue, isActive && styles.chipValueActive]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[styles.chipUnit, isActive && styles.chipUnitActive]}
                >
                  min
                </Text>
              </Surface>
            </TouchableOpacity>
          );
        })}

        {/* Custom option */}
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.75}
          style={{ flex: 1 }}
        >
          <Surface
            style={[
              styles.chip,
              styles.chipCustom,
              disabled && styles.chipDisabled,
            ]}
            elevation={0}
          >
            <Text style={styles.chipCustomText}>＋</Text>
            <Text style={styles.chipUnit}>custom</Text>
          </Surface>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXT_MUTED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipCustom: {
    borderStyle: "dashed",
    borderColor: BORDER,
    backgroundColor: "#FAFAF8",
  },
  chipValue: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_MAIN,
    lineHeight: 24,
  },
  chipValueActive: {
    color: "#FFFFFF",
  },
  chipUnit: {
    fontSize: 10,
    fontWeight: "500",
    color: TEXT_MUTED,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  chipUnitActive: {
    color: "#FFFFFF",
  },  
  chipCustomText: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_MUTED,
    lineHeight: 24,
  },
});

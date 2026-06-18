import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export default function StartButton({ isRunning, onStart, onPause, onReset }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={isRunning ? onPause : onStart}
      >
        <Text style={styles.text}>{isRunning ? "Pause" : "Start Sprint"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={onReset}
      >
        <Text style={styles.text}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
  resetButton: {
  marginTop: 10,
  backgroundColor: "#444",
},
});

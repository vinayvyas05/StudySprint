import { SafeAreaView, View, StyleSheet } from "react-native";
import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import { useState } from "react";
import StartButton from "@/components/sprint/StartButton";

export default function SprintScreen() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top} />

      <View style={styles.timerSection}>
        <CircularTimer />
      </View>

      <StartButton
        isRunning={isRunning}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsRunning(false)}
      />

      <View style={styles.bottom}>
        <SessionSelector
          selected={selectedDuration}
          setSelected={setSelectedDuration}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: 80,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  timerSection: {
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    height: 120,
  },
});

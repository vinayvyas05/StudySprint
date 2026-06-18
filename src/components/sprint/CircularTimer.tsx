import { View, Text, StyleSheet } from "react-native";

export default function CircularTimer({
  timeLeft,
}: {
  timeLeft: number;
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {minutes}:{seconds < 10 ? "0" : ""}
        {seconds}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
  },
});
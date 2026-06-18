import { View, Text, StyleSheet } from "react-native";

export default function CircularTimer() {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>25:00</Text>
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


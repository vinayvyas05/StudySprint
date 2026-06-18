import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  selected: number;
  setSelected: (value: number) => void;
};

export default function SessionSelector({
  selected,
  setSelected,
}: Props) {
  const options = [25, 50, 90];

  return (
    <View style={styles.container}>
      {options.map((time) => (
        <TouchableOpacity
          key={time}
          style={[
            styles.option,
            selected === time && styles.activeOption,
          ]}
          onPress={() => setSelected(time)}
        >
          <Text
            style={[
              styles.text,
              selected === time && styles.activeText,
            ]}
          >
            {time}m
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.option}>
        <Text style={styles.text}>Custom</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeOption: {
    backgroundColor: "#111",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
});
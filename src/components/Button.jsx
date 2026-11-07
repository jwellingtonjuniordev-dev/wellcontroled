import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

const currentTheme = Colors.dark;

export function Button({ title, onPress, variant = "primary" }) {
  const isDanger = variant === "danger";
  const backgroundColor = isDanger ? currentTheme.danger : currentTheme.primary;
  const textColor = isDanger ? "#FFF" : "#0B1120";

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

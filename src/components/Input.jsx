import { StyleSheet, TextInput } from "react-native";
import { Colors } from "../constants/colors";

const currentTheme = Colors.dark;

export function Input(props) {
  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: currentTheme.card,
          color: currentTheme.textPrimary,
          borderColor: currentTheme.border,
        },
      ]}
      placeholderTextColor={currentTheme.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
});

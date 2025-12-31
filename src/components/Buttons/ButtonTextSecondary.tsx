import { StyleSheet, Text, TouchableOpacity, useColorScheme, ViewStyle } from "react-native";
import { darkTheme, lightTheme } from "theme";

type ButtonProps = {
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export const ButtonTextSecondary = ({ title, icon, onPress, style }: ButtonProps) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {icon}
      <Text style={[styles.buttonText, { color: theme.textSecondary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";

type ButtonProps = {
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export const ButtonTextSecondary = ({ title, icon, onPress, style }: ButtonProps) => {
  const { theme } = useTheme();

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

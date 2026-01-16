import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";

type ButtonProps = {
  title: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export const ButtonText = ({ title, iconStart, iconEnd, onPress, style }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {iconStart}
      <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      {iconEnd}
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

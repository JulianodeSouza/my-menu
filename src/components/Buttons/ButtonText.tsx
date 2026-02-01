import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";
import { IButtonProps } from "~/types/buttons";
import Icon from "../Icon";

export const ButtonText = ({
  title,
  iconStart,
  iconEnd,
  iconSize = 20,
  onPress,
  style,
  iconColor,
}: IButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {iconStart ? <Icon name={iconStart} size={iconSize} color={iconColor || theme.text} /> : null}
      <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      {iconEnd ? <Icon name={iconEnd} size={iconSize} color={iconColor || theme.text} /> : null}
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

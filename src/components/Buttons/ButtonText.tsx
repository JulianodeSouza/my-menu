import * as icons from "lucide-react-native/icons";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";
import Icon from "../Icon";

type ButtonProps = {
  title: string;
  iconStart?: keyof typeof icons;
  iconEnd?: keyof typeof icons;
  iconSize?: number;
  onPress?: () => void;
  style?: ViewStyle;
};

export const ButtonText = ({
  title,
  iconStart,
  iconEnd,
  iconSize = 20,
  onPress,
  style,
}: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {iconStart ? <Icon name={iconStart} size={iconSize} color={theme.text} /> : null}
      <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      {iconEnd ? <Icon name={iconEnd} size={iconSize} color={theme.text} /> : null}
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

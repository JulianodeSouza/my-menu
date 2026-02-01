import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { borderRadius, fontWeights, spacing, typography } from "theme";
import { useTheme } from "~/contexts/ThemeContext";
import { IButtonProps } from "~/types/buttons";
import Icon from "../Icon";

type ButtonProps = {
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export const ButtonTextSecondary = ({
  title,
  iconStart,
  iconEnd,
  iconSize,
  iconColor,
  onPress,
  style,
}: IButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {iconStart ? <Icon name={iconStart} size={iconSize} color={iconColor || theme.text} /> : null}
      <Text style={[styles.buttonText, { color: theme.textSecondary }]}>{title}</Text>
      {iconEnd ? <Icon name={iconEnd} size={iconSize} color={iconColor || theme.text} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: borderRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    padding: spacing.sm,
  },
  buttonText: {
    fontSize: typography.fontSizeBase,
    fontWeight: fontWeights.bold,
    textAlign: "center",
  },
});

import { forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";
import { IButtonProps } from "~/types/buttons";
import Icon from "../Icon";

export const ButtonPrimary = forwardRef<View, IButtonProps>(
  ({ title, iconStart, iconEnd, iconSize, iconColor, ...buttonProps }, ref) => {
    const { theme } = useTheme();

    return (
      <TouchableOpacity
        ref={ref}
        {...buttonProps}
        style={[styles.button, buttonProps.style, { backgroundColor: theme.primary }]}>
        {iconStart ? (
          <Icon name={iconStart} size={iconSize} color={iconColor || theme.text} />
        ) : null}
        <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
        {iconEnd ? <Icon name={iconEnd} size={iconSize} color={iconColor || theme.text} /> : null}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

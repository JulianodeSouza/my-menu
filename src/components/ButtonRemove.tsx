import { forwardRef } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { darkTheme, lightTheme } from "theme";
import { ButtonProps } from "~/types/Buttons";

export const ButtonRemove = forwardRef<View, ButtonProps>(
  ({ title, icon, ...buttonProps }, ref) => {
    const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

    return (
      <TouchableOpacity
        ref={ref}
        {...buttonProps}
        style={[styles.button, buttonProps.style, { backgroundColor: theme.error }]}>
        {icon ? icon : null}

        <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 24,
    elevation: 5,
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
  },
});

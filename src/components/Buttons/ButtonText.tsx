import { Button } from "@rneui/base";
import { forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacityProps, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";


type ButtonProps = {
  title: string;
  icon?: React.ReactNode;
} & TouchableOpacityProps;

export const ButtonText = forwardRef<View, ButtonProps>(({ title, icon, ...buttonProps }, ref) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return (
    <Button
      type="clear"
      {...buttonProps}
      style={[styles.button, buttonProps.style, { backgroundColor: theme.primary }]}>
      {icon ? icon : null}

      <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
    </Button>
  );
});

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
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

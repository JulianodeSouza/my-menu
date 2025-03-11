import { forwardRef, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacityProps, useColorScheme, View } from "react-native";

import { darkTheme, lightTheme } from "~/theme";
type TextProps = {
  children: ReactNode;
  textProps?: any;
} & TouchableOpacityProps;

export const TextComponent = forwardRef<View, TextProps>(({ children, ...textProps }) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return <Text style={[styles.text, textProps.style, { color: theme.text }]}>{children}</Text>;
});

const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

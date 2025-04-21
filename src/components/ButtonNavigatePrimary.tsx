import { Link } from "expo-router";
import { forwardRef } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { IButtonLinkProps } from "~/types/Buttons";

export const ButtonNavigatePrimary = forwardRef<View, IButtonLinkProps>(
  ({ title, href, ...linkProps }) => {
    const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

    return (
      <Link
        href={href}
        style={[styles.link, linkProps.style, { backgroundColor: theme.primary }]}
        {...linkProps}>
        <Text style={styles.linkText}>{title}</Text>
      </Link>
    );
  }
);

const styles = StyleSheet.create({
  link: {
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
  linkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

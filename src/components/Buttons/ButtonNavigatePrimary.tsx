import { Link } from "expo-router";
import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";
import { IButtonLinkProps } from "~/types/Buttons";

export const ButtonNavigatePrimary = forwardRef<View, IButtonLinkProps>(
  ({ title, href, ...linkProps }) => {
    const { theme } = useTheme();

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

import { Link } from "expo-router";
import { StyleSheet, Text, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import { HeaderScreen } from "~/components/ScreenHeader";

export default function NotFoundScreen() {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return (
    <>
      <HeaderScreen headerShown={true} title="Oops!" />
      <Container>
        <Text style={[styles.title, { color: theme.text }]}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
    padding: 10,
    textAlign: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});

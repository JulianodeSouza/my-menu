import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Container } from "~/components/Container";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useTheme } from "~/contexts/ThemeContext";

export default function NotFoundScreen() {
  const { theme } = useTheme();

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

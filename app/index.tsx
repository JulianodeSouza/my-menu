import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";

import { ButtonPrimary } from "~/components/ButtonPrimary";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { darkTheme, lightTheme } from "~/theme";

export default function Home() {
  const actualTheme = useColorScheme();
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return (
    <>
      <HeaderScreen headerShown={false} />
      <Container>
        <StatusBar barStyle={actualTheme === "dark" ? "dark-content" : "light-content"} />

        <Link href={{ pathname: "/settings" }} asChild>
          <Feather name="settings" size={35} color={theme.text} style={styles.settingsButton} />
        </Link>

        <ScreenContent style={styles.containerHome}>
          <Link href={{ pathname: "/" }} asChild>
            <ButtonPrimary style={styles.button} title="Lista de mercado" />
          </Link>
        </ScreenContent>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  containerHome: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 300,
    margin: 15,
    borderRadius: 8,
    padding: 20,
  },
  settingsButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

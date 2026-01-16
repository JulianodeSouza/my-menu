import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useTheme } from "~/contexts/ThemeContext";
import ThemeOptions from "./ThemeOptions";

export default function Settings() {
  const { isDark } = useTheme();
  const router = useRouter();

  return (
    <>
      <HeaderScreen title="Configurações" />
      <Divider />
      <Container>
        <ScreenContent>
          <ThemeOptions />

          <Divider />
          <ButtonPrimary
            title="Categorias"
            style={styles.button}
            onPress={() => {
              router.push("/addCategory");
            }}
          />
        </ScreenContent>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 300,
    margin: 15,
  },
  titleModalTheme: { textAlign: "center", fontSize: 24, padding: 10 },
  titleSection: {
    opacity: 0.5,
    fontSize: 14,
    fontWeight: "bold",
    margin: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    margin: 15,
  },
});

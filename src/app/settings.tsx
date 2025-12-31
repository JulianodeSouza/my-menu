import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Checkbox, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Appearance, ColorSchemeName, StyleSheet, useColorScheme, View } from "react-native";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { ButtonTextSecondary } from "~/components/Buttons/ButtonTextSecondary";
import { Container } from "~/components/Container";
import { Modal } from "~/components/Modal";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { ButtonNavigatePrimary } from "~/components/Buttons/ButtonNavigatePrimary";
import { useRouter } from "expo-router";

export default function Settings() {
  const [themeSelected, setThemeSelected] = useState(useColorScheme());
  const [infoDialog, setInfoDialog] = useState({ open: false });
  const router = useRouter();

  const handleClose = () => {
    setInfoDialog({ open: false });
  };

  const changeColorScheme = (colorScheme: ColorSchemeName) => {
    setThemeSelected(colorScheme);
    Appearance.setColorScheme(colorScheme);
    saveInStorage(colorScheme);
  };

  const saveInStorage = async (colorScheme: ColorSchemeName) => {
    try {
      await AsyncStorage.setItem("theme", colorScheme);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <HeaderScreen title="Configurações" />
      <Container>
        <ScreenContent>
          <TextComponent style={styles.titleSection}>Customização</TextComponent>
          <ButtonPrimary
            title="Tema"
            style={styles.button}
            onPress={() => {
              setInfoDialog({ open: true });
            }}
          />

          <Divider />
          {/* <TextComponent style={styles.titleSection}>Lista de mercado</TextComponent> */}
          <ButtonPrimary
            title="Categorias"
            style={styles.button}
            onPress={() => {
              router.push("/addCategory");
            }}
          />
        </ScreenContent>
      </Container>

      {infoDialog.open && (
        <Modal visible={infoDialog.open} setVisible={setInfoDialog}>
          <TextComponent style={styles.titleModalTheme}>Selecione o tema</TextComponent>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={themeSelected === "light" ? "checked" : "unchecked"}
              onPress={() => changeColorScheme("light")}
            />
            <TextComponent>Modo Claro</TextComponent>
          </View>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={themeSelected === "dark" ? "checked" : "unchecked"}
              onPress={() => changeColorScheme("dark")}
            />
            <TextComponent>Modo Escuro</TextComponent>
          </View>

          <ButtonTextSecondary title="Fechar" onPress={handleClose} />
        </Modal>
      )}
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

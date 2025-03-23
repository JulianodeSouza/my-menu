import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox, Divider, Text } from "@rneui/base";
import { useState } from "react";
import { Appearance, ColorSchemeName, StyleSheet, useColorScheme } from "react-native";
import { ButtonPrimary } from "~/components/ButtonPrimary";
import { ButtonTextSecondary } from "~/components/ButtonTextSecondary";
import { Container } from "~/components/Container";
import { Modal } from "~/components/Modal";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";

export default function Settings() {
  const [themeSelected, setThemeSelected] = useState(useColorScheme());
  const [infoDialog, setInfoDialog] = useState({ open: false });

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
          <TextComponent style={styles.titleSection}>Lista de mercado</TextComponent>

          <ButtonPrimary title="Categorias" style={styles.button} />
        </ScreenContent>
      </Container>

      {infoDialog.open && (
        <Modal visible={infoDialog.open} setVisible={setInfoDialog} style={styles.modalTheme}>
          <TextComponent style={styles.titleModalTheme}>Selecione o tema</TextComponent>

          <CheckBox
            title={
              <Text>
                Modo claro
                <MaterialIcons name="light-mode" size={24} color="black" />
              </Text>
            }
            checked={themeSelected === "light"}
            onPress={() => changeColorScheme("light")}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          <CheckBox
            title={
              <Text>
                Modo Escuro
                <MaterialIcons
                  style={{ alignContent: "center" }}
                  name="dark-mode"
                  size={24}
                  color="black"
                />
              </Text>
            }
            checked={themeSelected === "dark"}
            onPress={() => changeColorScheme("dark")}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />

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
  modalTheme: {
    width: "80%",
    padding: 20,
  },
  titleModalTheme: { textAlign: "center", fontSize: 24, padding: 10 },
  titleSection: {
    opacity: 0.5,
    fontSize: 14,
    fontWeight: "bold",
    margin: 15,
  },
});

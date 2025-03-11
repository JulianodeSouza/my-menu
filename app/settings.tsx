import { CheckBox, Text } from "@rneui/base";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { ButtonPrimary } from "~/components/ButtonPrimary";
import { Container } from "~/components/Container";
import { Modal } from "~/components/Modal";
import { ScreenContent } from "~/components/ScreenContent";

export default function Settings() {
  const [theme, setTheme] = useState(useColorScheme());
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setIndex] = useState(0);

  return (
    <>
      <Stack.Screen options={{ title: "Configurações" }} />
      <Container>
        <ScreenContent>
          <ButtonPrimary
            title="Tema"
            style={styles.button}
            onPress={() => {
              setVisible(true);
            }}
          />
          <ButtonPrimary title="Categorias" style={styles.button} />
        </ScreenContent>
      </Container>

      {visible && (
        <Modal visible={visible} setVisible={setVisible}>
          <CheckBox
            checked={theme === "light"}
            onPress={() => setIndex(0)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          <CheckBox
            checked={theme === "dark"}
            onPress={() => setIndex(1)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          <Text>Modo claro</Text>
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
  button2: {
    margin: 10,
  },
});

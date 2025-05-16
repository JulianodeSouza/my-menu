import { Dialog } from "@rneui/base";
import { StyleSheet, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { ButtonPrimary } from "../Buttons/ButtonPrimary";
import { ButtonTextSecondary } from "../Buttons/ButtonTextSecondary";
import { TextComponent } from "../Text";

export const ModalConfirmation = () => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const { isVisible, message, onConfirm, closeModalConfirmation } = useModalConfirmation();

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={closeModalConfirmation}
      overlayStyle={{ backgroundColor: theme.background }}>
      <Dialog.Title titleStyle={[styles.title, { color: theme.text }]} title="Atenção" />
      <TextComponent style={styles.message}>{message}</TextComponent>

      <Dialog.Actions>
        <View style={styles.actionsButtons}>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}>
            <ButtonTextSecondary title="Cancelar" onPress={closeModalConfirmation} />
          </View>

          <ButtonPrimary
            title="Confirmar"
            onPress={() => {
              onConfirm();
              closeModalConfirmation();
            }}
          />
        </View>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  actionsButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
  cancel: {
    textAlign: "center",
  },
});

import { Portal, Dialog, Button, Text } from "react-native-paper";
import { StyleSheet, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { useModalConfirmation } from "~/contexts/DialogContext";

export const ModalConfirmation = () => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const { isVisible, message, onConfirm, closeModalConfirmation } = useModalConfirmation();

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={closeModalConfirmation}
        style={{ backgroundColor: theme.background }}>
        <Dialog.Title style={[styles.title, { color: theme.text }]}>Atenção</Dialog.Title>
        <Dialog.Content>
          <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actionsButtons}>
          <Button textColor={theme.textSecondary} onPress={closeModalConfirmation}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              onConfirm();
              closeModalConfirmation();
            }}>
            Confirmar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
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
    justifyContent: "center",
    gap: 10,
    paddingBottom: 16,
  },
  title: {
    textAlign: "center",
  },
});

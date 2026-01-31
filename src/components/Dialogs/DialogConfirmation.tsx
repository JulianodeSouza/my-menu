import { StyleSheet } from "react-native";
import { Dialog, Portal, Text } from "react-native-paper";
import { fontWeights, spacing, typography } from "theme";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useTheme } from "~/contexts/ThemeContext";
import { ButtonPrimary } from "../Buttons/ButtonPrimary";
import { ButtonText } from "../Buttons/ButtonText";

export const ModalConfirmation = () => {
  const { theme } = useTheme();
  const { isVisible, message, onConfirm, closeModalConfirmation } = useModalConfirmation();

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={closeModalConfirmation}
        style={{ backgroundColor: theme.secondary }}>
        <Dialog.Title style={[styles.title, { color: theme.text }]}>Atenção</Dialog.Title>
        <Dialog.Content>
          <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actionsButtons}>
          <ButtonText title="Cancelar" onPress={closeModalConfirmation} />

          <ButtonPrimary
            style={styles.buttonConfirm}
            title="Confirmar"
            onPress={() => {
              onConfirm();
              closeModalConfirmation();
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: typography.fontSizeBase,
    textAlign: "center",
    marginBottom: spacing.lg,
    fontWeight: fontWeights.bold,
  },
  actionsButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  title: {
    textAlign: "center",
  },
  buttonConfirm: {
    borderRadius: 10,
    padding: spacing.sm,
  },
});

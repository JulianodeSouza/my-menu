import { Portal, Modal as PaperModal } from "react-native-paper";
import { ReactNode } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";

type ModalProps = {
  children: ReactNode;
  visible: boolean;
  setVisible: any;
};

export const Modal = ({ children, visible, setVisible }: ModalProps) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  const toggleOverlay = () => {
    setVisible({ open: !visible });
  };

  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={toggleOverlay}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.background }]}>
        {children}
      </PaperModal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});

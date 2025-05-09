import { Overlay, OverlayProps } from "@rneui/themed";
import { ReactNode } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "theme";

type ModalProps = {
  children: ReactNode;
  visible: boolean;
  setVisible: any;
} & Partial<OverlayProps>;

export const Modal = ({ children, visible, setVisible, ...rest }: ModalProps) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  const toggleOverlay = () => {
    setVisible({ open: !visible });
  };

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={[styles.overlay, { backgroundColor: theme.background }, rest.style]}>
      {children}
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    padding: 20,
    width: "80%",
  },
});

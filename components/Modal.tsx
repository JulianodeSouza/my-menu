import { Button, Overlay } from "@rneui/themed";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  visible: boolean;
  setVisible: any;
};

export const Modal = ({ children, visible, setVisible }: ModalProps) => {
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      {children}
      <Button type="clear" title="Fechar" onPress={toggleOverlay} />
    </Overlay>
  );
};

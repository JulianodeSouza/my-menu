import { Button, Overlay } from '@rneui/themed';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
});

import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonPrimary } from '~/components/ButtonPrimary';
import { Container } from '~/components/Container';
import { Modal } from '~/components/Modal';
import { ScreenContent } from '~/components/ScreenContent';

export default function Settings() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Stack.Screen options={{ title: 'Configurações' }} />
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
          <ButtonPrimary
            title="Modo Escuro"
            style={styles.button}
            onPress={() => {
              setVisible(true);
            }}
          />
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

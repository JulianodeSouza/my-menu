import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ButtonPrimary } from '~/components/ButtonPrimary';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function ScreenMode() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Customizar', statusBarStyle: 'dark' }} />

      <ScreenContent>
        <ButtonPrimary
          style={styles.button}
          title="Modo Escuro"
          icon={<MaterialIcons name="dark-mode" size={24} color="black" style={styles.icon} />}
        />

        <ButtonPrimary
          style={styles.button}
          title="Modo Claro"
          icon={<MaterialIcons name="light-mode" size={24} color="white" style={styles.icon} />}
        />
      </ScreenContent>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 15,
  },
  icon: {
    marginRight: 10,
  },
});

import { Stack } from 'expo-router';
import { Text } from 'react-native';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Details() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true }} />
      <Container>
        <ScreenContent>
          <Text>Details</Text>
        </ScreenContent>
      </Container>
    </>
  );
}

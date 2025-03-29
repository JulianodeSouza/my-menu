import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from 'theme';


export const Container = ({ children }: { children: ReactNode }) => {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

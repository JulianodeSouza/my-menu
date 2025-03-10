import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacityProps, useColorScheme, View } from 'react-native';

import { darkTheme, lightTheme } from '~/theme';
type TextProps = {
  title: string;
  textProps?: any;
} & TouchableOpacityProps;

export const TextComponent = forwardRef<View, TextProps>(({ title, textProps }) => {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;

  return <Text style={[styles.text, textProps.style, { color: theme.text }]}>{title}</Text>;
});

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

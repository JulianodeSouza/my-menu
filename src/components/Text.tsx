import { Text, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "theme";

export const TextComponent = ({ children, ...TextProps }) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return <Text style={[{ color: theme.text, ...TextProps.style }]}>{children}</Text>;
};

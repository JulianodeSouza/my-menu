import { Text, TextProps, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "theme";

type TextComponentProps = {
  children: React.ReactNode;
} & TextProps;

export const TextComponent = ({ children, ...textProps }: TextComponentProps) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return (
    <Text style={[textProps.style, { color: theme.text }]} {...{ textProps }}>
      {children}
    </Text>
  );
};

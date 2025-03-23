import { TouchableHighlight, TouchableHighlightProps, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "theme";

export const TextTouchable = ({ children, ...rest }: TouchableHighlightProps) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return (
    <TouchableHighlight underlayColor={theme.background} {...rest}>
      {children}
    </TouchableHighlight>
  );
};

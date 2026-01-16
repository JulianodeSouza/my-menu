import { TouchableHighlight, TouchableHighlightProps } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";

export const TextTouchable = ({ children, ...rest }: TouchableHighlightProps) => {
  const { theme } = useTheme();

  return (
    <TouchableHighlight underlayColor={theme.background} {...rest}>
      {children}
    </TouchableHighlight>
  );
};

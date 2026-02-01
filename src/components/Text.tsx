import { Text, TextProps } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";
import { typography } from "../../theme";

type TextComponentProps = {
  children: React.ReactNode;
  size?: keyof typeof typography;
} & TextProps;

export const TextComponent = ({ children, size, ...textProps }: TextComponentProps) => {
  const { theme } = useTheme();
  const fontSize = size ? typography[size] : typography.fontSizeBase;

  return (
    <Text style={[{ fontSize, color: theme.text }, textProps.style]} {...{ textProps }}>
      {children}
    </Text>
  );
};

import { Stack } from "expo-router";
import { useTheme } from "~/contexts/ThemeContext";

type HeaderProps = {
  headerShown?: boolean;
  title?: string;
};

export const HeaderScreen = ({ title, headerShown }: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <Stack.Screen
      options={{
        headerShown: headerShown,
        title: title,
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  );
};

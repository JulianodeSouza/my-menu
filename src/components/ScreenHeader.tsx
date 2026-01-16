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
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  );
};

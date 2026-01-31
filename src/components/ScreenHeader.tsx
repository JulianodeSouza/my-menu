import { Stack } from "expo-router";
import { useTheme } from "~/contexts/ThemeContext";
import { IHeaderProps } from "~/types/header";

export const HeaderScreen = ({ title, headerShown, headerRight }: IHeaderProps) => {
  const { theme } = useTheme();

  return (
    <Stack.Screen
      options={{
        headerShown: headerShown,
        title: title,
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerRight: headerRight,
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

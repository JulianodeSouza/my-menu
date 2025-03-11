import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "~/theme";

type HeaderProps = {
  headerShown?: boolean;
  title?: string;
};

export const HeaderScreen = ({ title, headerShown }: HeaderProps) => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

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

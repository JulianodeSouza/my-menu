import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import { Appearance, ColorSchemeName } from "react-native";

export default function Layout() {
  const getTheme = useCallback(async () => {
    const theme = await AsyncStorage.getItem("theme");

    if (theme) {
      Appearance.setColorScheme(theme as ColorSchemeName);
    }
  }, []);

  useEffect(() => {
    getTheme();
  }, [getTheme]);

  return <Stack />;
}

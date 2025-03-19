import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { initializeDatabase } from "./db/initializeDatabase";

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

  return (
    <SQLiteProvider databaseName="myMenu.db" onInit={initializeDatabase} useSuspense>
      <Stack />;
    </SQLiteProvider>
  );
}

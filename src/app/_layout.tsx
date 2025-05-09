import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "~/store";
import { initializeDatabase } from "../db/initializeDatabase";
import { Toast } from "~/components/Toast";
import { ModalProvider } from "~/contexts/DialogContext";
import { ModalConfirmation } from "~/components/Dialogs/DialogConfirmation";

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
    <ModalProvider>
      <SQLiteProvider databaseName="myMenu.db" onInit={initializeDatabase} useSuspense>
        <ReduxProvider store={store}>
          <Stack />

          <Toast />

          <ModalConfirmation />
        </ReduxProvider>
      </SQLiteProvider>
    </ModalProvider>
  );
}

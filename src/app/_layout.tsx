import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { ApiProvider } from "~/ApiContext";
import { ModalConfirmation } from "~/components/Dialogs/DialogConfirmation";
import { Toast } from "~/components/Toast";
import { ModalProvider } from "~/contexts/DialogContext";
import { initializeDatabase } from "~/db/initializeDatabase";
import { store } from "~/store";

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
          <ApiProvider>
            <Stack />

            <Toast />
          </ApiProvider>
          <ModalConfirmation />
        </ReduxProvider>
      </SQLiteProvider>
    </ModalProvider>
  );
}

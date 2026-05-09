import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { ApiProvider } from "~/ApiContext";
import { ModalConfirmation } from "~/components/Dialogs/DialogConfirmation";
import { SplashScreen as AnimatedSplash } from "~/components/SplashScreen";
import { Toast } from "~/components/Toast";
import { ModalProvider } from "~/contexts/DialogContext";
import { ThemeProvider } from "~/contexts/ThemeContext";
import { store } from "~/store";

// Previne que o splash screen feche automaticamente
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  const getTheme = useCallback(async () => {
    const theme = await AsyncStorage.getItem("theme");

    if (theme) {
      Appearance.setColorScheme(theme as ColorSchemeName);
    }
  }, []);

  useEffect(() => {
    const prepare = async () => {
      await getTheme();
      // Esconde o splash screen nativo para mostrar o animado
      await SplashScreen.hideAsync();
    };

    prepare();
  }, [getTheme]);

  return (
    <ThemeProvider>
      <PaperProvider>
        <ModalProvider>
          <ReduxProvider store={store}>
            <ApiProvider>
              <AnimatedSplash
                isVisible={showAnimatedSplash}
                onFinish={() => setShowAnimatedSplash(false)}
              />

              {!showAnimatedSplash && (
                <>
                  <Stack />
                  <Toast />
                </>
              )}
            </ApiProvider>
            <ModalConfirmation />
          </ReduxProvider>
        </ModalProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

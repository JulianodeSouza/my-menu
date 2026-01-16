import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Appearance, ColorSchemeName, StyleSheet, View } from "react-native";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { TextComponent } from "~/components/Text";
import { useTheme } from "~/contexts/ThemeContext";

export default function ThemeOptions() {
  const { isDark } = useTheme();
  const [themeSelected, setThemeSelected] = useState<ColorSchemeName>(isDark ? "dark" : "light");

  const changeColorScheme = (colorScheme: ColorSchemeName) => {
    setThemeSelected(colorScheme);
    Appearance.setColorScheme(colorScheme);
    saveInStorage(colorScheme);
  };

  const saveInStorage = async (colorScheme: ColorSchemeName) => {
    try {
      await AsyncStorage.setItem("theme", colorScheme);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <ScreenContent>
        <View>
          <TextComponent style={styles.title}>Aparência</TextComponent>
          <TextComponent style={styles.subtitle}>Escolha o tema do aplicativo</TextComponent>
        </View>
      </ScreenContent>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {},
  subtitle: {},
  sectionColor: {},
});

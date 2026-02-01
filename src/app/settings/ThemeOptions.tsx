import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useMemo, useState } from "react";
import { Appearance, ColorSchemeName, StyleSheet, TouchableOpacity, View } from "react-native";
import { borderRadius, fontWeights, spacing, typography } from "theme";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useTheme } from "~/contexts/ThemeContext";

type ThemeOptionConfig = {
  id: ColorSchemeName;
  icon: "Sun" | "Moon" | "Monitor";
  label: string;
  description: string;
};

const THEME_OPTIONS: ThemeOptionConfig[] = [
  {
    id: "light",
    icon: "Sun",
    label: "Claro",
    description: "Tema claro",
  },
  {
    id: "dark",
    icon: "Moon",
    label: "Escuro",
    description: "Tema escuro",
  },
  {
    id: "auto" as ColorSchemeName,
    label: "Automático",
    icon: "Monitor",
    description: "Segue o sistema",
  },
];

const STORAGE_KEY = "theme";

type ThemeOptionItemProps = {
  option: ThemeOptionConfig;
  isSelected: boolean;
  onSelect: (id: ColorSchemeName) => void;
};

function ThemeOptionItem({ option, isSelected, onSelect }: ThemeOptionItemProps) {
  const { theme } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      container: {
        borderColor: isSelected ? theme.primary : theme.border,
      },
      iconWrapper: {
        backgroundColor: isSelected ? theme.primary : theme.border,
      },
      iconColor: isSelected ? theme.primaryForeground : theme.text,
    }),
    [isSelected, theme]
  );

  const handlePress = useCallback(() => {
    onSelect(option.id);
  }, [option.id, onSelect]);

  return (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        dynamicStyles.container,
        { backgroundColor: isSelected ? theme.primaryOpacity5 : "transparent" },
      ]}
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${option.label}: ${option.description}`}>
      <View style={styles.optionContent}>
        <View style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
          <Icon name={option.icon} color={dynamicStyles.iconColor} />
        </View>
        <View style={styles.textsContainer}>
          <TextComponent>{option.label}</TextComponent>
          <TextComponent style={styles.subtitle}>{option.description}</TextComponent>
        </View>
      </View>
      {isSelected && <Icon name="Check" color={theme.primary} />}
    </TouchableOpacity>
  );
}

export default function ThemeOptions() {
  const { isDark, theme } = useTheme();
  const [themeSelected, setThemeSelected] = useState<ColorSchemeName>(isDark ? "dark" : "light");

  const handleThemeChange = useCallback(async (colorScheme: ColorSchemeName) => {
    setThemeSelected(colorScheme);
    Appearance.setColorScheme(colorScheme);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, colorScheme ?? "");
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  }, []);

  const headerIconStyle = useMemo(
    () => ({
      backgroundColor: theme.primaryOpacity10,
      padding: spacing.sm,
      borderRadius: borderRadius.xl,
    }),
    [theme.primaryOpacity10]
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={headerIconStyle}>
          <Icon name="Palette" color={theme.primary} />
        </View>
        <View>
          <TextComponent style={styles.title}>Aparência</TextComponent>
          <TextComponent style={styles.subtitle}>Escolha o tema do aplicativo</TextComponent>
        </View>
      </View>

      {THEME_OPTIONS.map((option) => (
        <ThemeOptionItem
          key={option.id}
          option={option}
          isSelected={themeSelected === option.id}
          onSelect={handleThemeChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSizeLg,
    fontWeight: fontWeights.bold,
  },
  subtitle: {
    fontSize: typography.fontSizeSm,
    opacity: 0.7,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrapper: {
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  textsContainer: {
    flexDirection: "column",
  },
});

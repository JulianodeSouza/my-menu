import { StyleSheet, View } from "react-native";
import { typography } from "theme";
import Icon from "~/components/Icon";
import { ScreenContent } from "~/components/ScreenContent";
import { TextComponent } from "~/components/Text";
import { useTheme } from "~/contexts/ThemeContext";

export default function EmptyList() {
  const { theme } = useTheme();
  return (
    <ScreenContent style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="ShoppingCart" size={60} color={theme.primaryDark} />
      </View>
      <TextComponent style={styles.title}>Sua lista está vazia</TextComponent>
      <TextComponent style={styles.subtitle}>
        Comece adicionando itens à sua lista de compras
      </TextComponent>
    </ScreenContent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  iconContainer: {
    backgroundColor: "#22c55e15",
    padding: 20,
    borderRadius: 100,
  },
  title: {
    fontWeight: "bold",
    fontSize: typography.fontSizeTitle,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: "center",
  },
});

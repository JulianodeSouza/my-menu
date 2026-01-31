import { StyleSheet, View } from "react-native";
import { typography } from "theme";
import CardShop from "~/components/CardShop";
import Icon from "~/components/Icon";
import { ScreenContent } from "~/components/ScreenContent";
import { TextComponent } from "~/components/Text";
import { useShoppingContext } from "~/contexts/ShoppingContext";
import { useTheme } from "~/contexts/ThemeContext";
import { formatMonetary } from "~/utils/stringUtils";

export default function ShoppingStatus() {
  const { theme } = useTheme();
  const shoppingContext = useShoppingContext();

  const totalMarked = shoppingContext.shoppingList.reduce((acc, category) => {
    const markedItems = category.items.filter((item) => item.checked).length;
    return acc + markedItems;
  }, 0);

  return (
    <ScreenContent style={styles.container}>
      <View style={styles.cardsInfosContainer}>
        <CardShop>
          <View style={styles.titleCardContainer}>
            <Icon name="ShoppingCart" color={theme.primary} size={15} />
            <TextComponent style={styles.title}>Itens</TextComponent>
          </View>
          <TextComponent style={styles.subTitle}>
            {totalMarked}/{shoppingContext.shoppingList.length}
          </TextComponent>
        </CardShop>
        <CardShop>
          <View style={styles.titleCardContainer}>
            <Icon name="CircleCheck" color={theme.primary} size={15} />
            <TextComponent style={styles.title}>Progresso</TextComponent>
          </View>
          <TextComponent style={styles.subTitle}>{shoppingContext.progress}%</TextComponent>
        </CardShop>
        <CardShop>
          <View style={styles.titleCardContainer}>
            <Icon name="DollarSign" color={theme.primary} size={15} />
            <TextComponent style={styles.title}>Total</TextComponent>
          </View>
          <TextComponent style={styles.subTitle}>
            {formatMonetary(shoppingContext.totalPurchase)}
          </TextComponent>
        </CardShop>
      </View>
    </ScreenContent>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  cardsInfosContainer: {
    display: "flex",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  title: {
    opacity: 0.7,
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: typography.fontSizeXl,
  },
});

import { StyleSheet, TouchableOpacity } from "react-native";
import { borderRadius, spacing } from "theme";
import { ScreenContent } from "~/components/ScreenContent";
import { useTheme } from "~/contexts/ThemeContext";
import { ICardShop } from "~/types/shopList";

export default function CardShop(props: ICardShop) {
  const { theme } = useTheme();

  return (
    <>
      {props.isPressable ? (
        <TouchableOpacity onPress={props.onPress}>
          <ScreenContent
            style={[
              styles.cardContainer,
              { backgroundColor: theme.card, borderColor: theme.border, ...props.styles },
            ]}>
            {props.children}
          </ScreenContent>
        </TouchableOpacity>
      ) : (
        <ScreenContent
          style={[
            styles.cardContainer,
            { backgroundColor: theme.card, borderColor: theme.border, ...props.styles },
          ]}>
          {props.children}
        </ScreenContent>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});

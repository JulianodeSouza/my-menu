import { useCallback, useState } from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { borderRadius, fontWeights, spacing, typography } from "theme";
import { useApi } from "~/ApiContext";
import { ButtonText } from "~/components/Buttons/ButtonText";
import CardShop from "~/components/CardShop";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useShoppingContext } from "~/contexts/ShoppingContext";
import { useTheme } from "~/contexts/ThemeContext";
import { setInfoToast } from "~/store/reducers/geral";
import { IListPurchase, IListPurchaseView } from "~/types/shopList";
import { formatNumberToMonetary } from "~/utils/stringUtils";
import { calculateProgress, calculateValuesByMeasuredUnits } from "~/utils/sumUtils";
import DialogItem from "./DialogItem";

type ModalMode = "edit" | "mark";

type EditionModalProps = {
  open: boolean;
  item?: IListPurchase;
  mode?: ModalMode;
};
export default function CardItemsList({ items, category, categoryIcon, index }: IListPurchaseView) {
  const dispatch = useDispatch();
  const {
    shoppingList,
    setProgress,
    setAnyItemMarked,
    setShoppingList,
    setTotalPurchase,
    setLoadItems,
  } = useShoppingContext();
  const confirmationModal = useModalConfirmation();
  const { deleteApi, postApi } = useApi();
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const checkedCount = items.filter((item) => item.checked).length;
  const totalProgress = (checkedCount / items.length) * 100;
  const [sheetModalInfo, setSheetModalInfo] = useState<EditionModalProps>({ open: false });

  const handlePress = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setExpandedIndex(expandedIndex === 0 ? null : 0);
  };

  const calculateShoppingListTotal = useCallback((list: IListPurchaseView[]) => {
    let total = 0;
    let havePendingInfo = false;

    for (const shoppingItem of list) {
      for (const item of shoppingItem.items) {
        if (item.checked && item.amount && (item.totalCaught || item.quantity)) {
          total += calculateValuesByMeasuredUnits(
            item.amount,
            item.totalCaught || item.quantity,
            item.unitSymbol
          );
        } else if (item.checked && (!item.amount || (!item.totalCaught && !item.quantity))) {
          setSheetModalInfo({ open: true, item, mode: "mark" });
          havePendingInfo = true;
          break;
        }
        if (havePendingInfo) break;
      }
    }

    if (havePendingInfo) return;

    const progress = calculateProgress(list);
    setProgress(progress);
    setShoppingList(list);
    setTotalPurchase(total);
  }, []);

  const markItem = useCallback(
    (itemId: number, checked: boolean) => {
      const updatedList = shoppingList.map((category) => ({
        ...category,
        items: category.items.map((item) => (item.id === itemId ? { ...item, checked } : item)),
      }));

      calculateShoppingListTotal(updatedList);
    },
    [shoppingList, calculateShoppingListTotal]
  );

  const removeItem = useCallback(
    async (idItem: number) => {
      confirmationModal.openModalConfirmation("Deseja realmente excluir este item?", async () => {
        await deleteApi(`list-supermarket/${idItem}`);

        dispatch(
          setInfoToast({
            open: true,
            message: "Item removido com sucesso!",
            type: "success",
          })
        );

        setLoadItems(true);
      });
    },
    [deleteApi, dispatch, setLoadItems]
  );

  const unmarkItemPurchase = useCallback(
    async (item: IListPurchase) => {
      const itemToSend = {
        ...item,
        amount: 0,
        totalCaught: 0,
        checked: false,
      };

      await postApi(`list-supermarket/mark-item/${item.id}`, itemToSend);
      setLoadItems(true);
    },
    [postApi, markItem]
  );

  const registerItemPurchase = useCallback(
    async (purchasedItem: IListPurchase) => {
      const itemToSend = {
        ...purchasedItem,
        checked: true,
      };

      await postApi(`list-supermarket/mark-item/${purchasedItem.id}`, itemToSend);
      setLoadItems(true);
    },
    [postApi, markItem]
  );

  return (
    <>
      <CardShop
        isPressable={true}
        onPress={handlePress}
        styles={expandedIndex === null ? styles.spacingAccordions : undefined}>
        <View style={styles.containerAccordion}>
          <View style={styles.infoAccordion}>
            <Icon name={categoryIcon} color={theme.primary} size={35} />
            <View>
              <View style={styles.titleContainer}>
                <TextComponent style={styles.title}>{category}</TextComponent>
              </View>
              <TextComponent style={[styles.subTitle, { color: theme.textMuted }]}>
                {checkedCount} de {items.length} item
              </TextComponent>
            </View>
          </View>

          <View style={styles.accordionActions}>
            <View
              style={[
                styles.progressBarContainer,
                { backgroundColor: theme.secondary, padding: totalProgress > 0 ? 0 : spacing.xs },
              ]}>
              {totalProgress === 0 ? null : (
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: theme.primary,
                      width: `${totalProgress}%`,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.expandIcon,
                {
                  transform: [{ rotate: expandedIndex === 0 ? "180deg" : "0deg" }],
                },
              ]}>
              <Icon name="ChevronDown" color={theme.primary} size={20} />
            </View>
          </View>
        </View>
      </CardShop>

      {expandedIndex === 0 && (
        <View
          style={[
            styles.itemsContainer,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}>
          {items.map((item) => (
            <View key={item.id} style={[styles.itemRow, { borderColor: theme.border }]}>
              <View style={styles.itemInfoContainer}>
                <RadioButton
                  color={theme.primaryDark}
                  value="first"
                  status={item.checked ? "checked" : "unchecked"}
                  onPress={() => {
                    if (item.checked) {
                      unmarkItemPurchase(item);
                    } else {
                      markItem(item.id, !item.checked);
                    }
                  }}
                />
                <View>
                  <TextComponent
                    style={
                      item.checked ? [styles.checkedItem, { color: theme.textMuted }] : undefined
                    }>
                    {item.name}
                  </TextComponent>
                  <View style={styles.quantityContainer}>
                    <TextComponent style={[styles.itemQuantity, { color: theme.textMuted }]}>
                      {item.quantity} {item.unitSymbol}
                    </TextComponent>
                    {Number(item.totalCaught || 0) > 0 && (
                      <>
                        <TextComponent style={[styles.itemQuantity, { color: theme.textMuted }]}>
                          •
                        </TextComponent>
                        <TextComponent style={[styles.itemQuantity, { color: theme.textMuted }]}>
                          {formatNumberToMonetary(item.amount || 0)}
                        </TextComponent>
                      </>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.buttonsContainer}>
                <View>
                  {!!item.checked && (
                    <TextComponent style={[styles.itemTotal, { color: theme.textMuted }]}>
                      {formatNumberToMonetary(
                        calculateValuesByMeasuredUnits(
                          item.amount || 0,
                          item.totalCaught,
                          item.unitSymbol
                        )
                      )}
                    </TextComponent>
                  )}
                </View>
                {/* <ButtonText
                  title=""
                  iconStart="Pen"
                  iconSize={15}
                  onPress={() => setSheetModalInfo({ open: true, item, mode: "edit" })}
                /> */}
                <ButtonText
                  title=""
                  iconStart="Trash2"
                  iconSize={15}
                  iconColor={theme.error}
                  onPress={() => {
                    removeItem(item.id);
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {sheetModalInfo.open && (
        <DialogItem
          {...{
            mode: sheetModalInfo.mode === "edit" ? "edit" : "mark",
            title: sheetModalInfo.mode === "edit" ? "Editar Item" : "Informações do item",
            isEdit: sheetModalInfo.mode === "edit",
            infoDialog: sheetModalInfo,
            onClose() {
              setSheetModalInfo({ open: false });
            },
            handleActionForm(values, mode) {
              if (mode === "mark") {
                registerItemPurchase(values);
              }
            },
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  spacingAccordions: {
    marginBottom: spacing.lg,
  },
  containerAccordion: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  infoAccordion: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    width: 100,
  },
  title: {
    flex: 1,
    fontWeight: fontWeights.semibold,
    fontSize: typography.fontSizeLg,
  },
  expandIcon: {
    padding: spacing.sm,
  },
  subTitle: {
    fontSize: typography.fontSizeSm,
  },
  itemsContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  itemInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemQuantity: {
    fontSize: typography.fontSizeSm,
  },
  accordionActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  progressBarContainer: {
    borderRadius: borderRadius.md,
    width: "50%",
  },
  progressBar: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
  itemTotal: {
    fontWeight: fontWeights.semibold,
  },
});

import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { ButtonTextSecondary } from "~/components/Buttons/ButtonTextSecondary";
import FloatingButton from "~/components/Buttons/FloatingButton";
import { Container } from "~/components/Container";
import ScrollContent from "~/components/ScrollContent";
import { useShoppingContext } from "~/contexts/ShoppingContext";
import { setInfoToast } from "~/store/reducers/geral";
import { IDialog } from "~/types/dialog";
import { formatDecimal } from "~/utils/stringUtils";
import CardItemsList from "./CardItemsList";
import DialogItem from "./DialogItem";
import EmptyList from "./EmptyList";
import ShoppingStatus from "./ShoppingStatus";

export default function ShopList() {
  const { postApi } = useApi();
  const dispatch = useDispatch();
  const {
    shoppingList,
    setLoadItems,
    setRefreshItems,
    refreshItems,
    anyItemMarked,
    finishPurchase,
  } = useShoppingContext();
  const [newItemModal, setNewItemModal] = useState<Pick<IDialog, "open">>({
    open: false,
  });

  useFocusEffect(
    useCallback(() => {
      setLoadItems(true);
    }, [])
  );

  const save = async (values) => {
    setNewItemModal({ open: false });

    const data = {
      name: values.name.trim(),
      quantity: formatDecimal(values.quantity),
      category: values.category,
      measuredUnit: values.measuredUnit,
      amount: values.amount,
    };

    await postApi("list-supermarket", data);

    dispatch(
      setInfoToast({
        open: true,
        message: "Item adicionado com sucesso!",
        type: "success",
      })
    );
    setLoadItems(true);
  };

  return (
    <>
      <Container>
        <ScrollContent
          refreshing={refreshItems}
          onRefreshControl={() => {
            setRefreshItems(true);
          }}>
          <ShoppingStatus />

          {shoppingList.length === 0 && (
            <View style={styles.emptyContainer}>
              <EmptyList />
            </View>
          )}

          {shoppingList.length > 0 && (
            <>
              {shoppingList.map((itemList, index) => (
                <CardItemsList
                  key={itemList.category}
                  {...{
                    items: itemList.items,
                    category: itemList.category,
                    categoryIcon: itemList.categoryIcon,
                    index,
                  }}
                />
              ))}
            </>
          )}
        </ScrollContent>

        <View style={styles.footer}>
          {anyItemMarked && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <ButtonTextSecondary title="Finalizar compra" onPress={finishPurchase} />
            </View>
          )}

          <FloatingButton
            color="green"
            onPress={() => {
              setNewItemModal({ open: true });
            }}
          />
        </View>
      </Container>

      {newItemModal.open && (
        <DialogItem
          mode={"register"}
          title={"Adicionar Item"}
          infoDialog={newItemModal}
          handleActionForm={save}
          onClose={() => setNewItemModal({ open: false })}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
  },
});

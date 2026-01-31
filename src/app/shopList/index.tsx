import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
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
  const shoppingContext = useShoppingContext();
  const [newItemModal, setNewItemModal] = useState<Pick<IDialog, "open">>({
    open: false,
  });

  useFocusEffect(
    useCallback(() => {
      shoppingContext.setLoadItems(true);
    }, [])
  );

  const save = async (values) => {
    setNewItemModal({ open: false });

    const data = {
      name: values.name.trim(),
      quantity: formatDecimal(values.quantity),
      category: values.category,
      measuredUnit: values.measuredUnit,
    };

    await postApi("list-supermarket", data);

    dispatch(
      setInfoToast({
        open: true,
        message: "Item adicionado com sucesso!",
        type: "success",
      })
    );
    shoppingContext.setLoadItems(true);
  };

  return (
    <>
      <Container>
        <ScrollContent
          refreshing={shoppingContext.refreshItems}
          onRefreshControl={() => {
            shoppingContext.setRefreshItems(true);
          }}>
          <ShoppingStatus />

          {shoppingContext.shoppingList.length === 0 && (
            <View style={styles.emptyContainer}>
              <EmptyList />
            </View>
          )}

          {shoppingContext.shoppingList.length > 0 && (
            <>
              {shoppingContext.shoppingList.map((itemList, index) => (
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
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 10,
  },
});

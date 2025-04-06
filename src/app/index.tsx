import Feather from "@expo/vector-icons/Feather";
import { Divider, FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import ModalMarkItemList from "~/components/ModalMarkItemList";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { TextTouchable } from "~/components/TextTouchable";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { resetRefresh, setInfoToast } from "~/store/reducers/geral";
import { formatMonetary } from "~/utils/stringUtils";

export default function Home() {
  const dispatch = useDispatch();
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const { geral } = useSelector((state: any) => state);
  const { openModalConfirmation } = useModalConfirmation();
  const [items, setItems] = useState([]);
  const [loadItems, setLoadItems] = useState(false);
  const [infoDialog, setInfoDialog] = useState({ open: false, item: {} });
  const [totalPurchase, setTotalPurchase] = useState(0);
  const purchaseListDatabase = useListPurchaseDatabase();

  const remove = async (idItem: number) => {
    await purchaseListDatabase
      .removeItem(idItem)
      .then(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Item removido com sucesso!",
            type: "success",
          })
        );
        setLoadItems(true);
      })
      .catch(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Houve um erro ao remover o item. Por favor, tente novamente.",
            type: "error",
          })
        );
      });
  };

  const finishPurchase = async () => {
    await purchaseListDatabase
      .finishPurchase()
      .then(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Compra finalizada com sucesso!",
            type: "success",
          })
        );
        setTotalPurchase(0);
        setLoadItems(true);
      })
      .catch(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Houve um erro ao finalizar a compra. Por favor, tente novamente.",
            type: "error",
          })
        );
      });
  };

  const showModalRemoveItem = (idItem: number) => {
    openModalConfirmation(
      "Certeza que deseja remover este item? Esta ação não pode ser desfeita",
      () => {
        remove(idItem);
      }
    );
  };

  const showModalFinishPurchase = () => {
    let haveItemUnchecked = false;
    openModalConfirmation(
      "Deseja finalizar a compra? Todos os itens serão removidos e o valor será zerado",
      () => {
        finishPurchase();
      }
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const results = await purchaseListDatabase.listAllItems();

      const itemsByCategory = [];
      for (const result of results) {
        const categoryAlredayExist = itemsByCategory.find(
          (category) => category.category === result.category
        );

        if (!categoryAlredayExist) {
          const itemList = {
            category: result.category,
            items: [result],
          };

          itemsByCategory.push(itemList);
        } else {
          const index = itemsByCategory.findIndex(
            (category) => category.category === result.category
          );

          itemsByCategory[index].items.push(result);
        }
      }

      setItems(itemsByCategory);
    };

    if (loadItems) {
      setLoadItems(false);
      loadData();
      dispatch(resetRefresh());
    }
  }, [loadItems]);

  useEffect(() => {
    setLoadItems(true);
  }, [geral.refreshItens]);

  return (
    <>
      <HeaderScreen headerShown={false} />
      <Container>
        <StatusBar
          animated={true}
          barStyle={theme === darkTheme ? "dark-content" : "light-content"}
        />

        <View style={{ padding: 25 }}>
          <Link href={{ pathname: "/settings" }} asChild>
            <Feather name="settings" size={35} color={theme.text} style={styles.settingsButton} />
          </Link>
        </View>

        <ScreenContent style={styles.containerList}>
          <ScrollView style={{ flex: 1, height: "90%" }} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.category}>
                <TextComponent style={styles.title}>{item.category}</TextComponent>

                <Divider />
                {item.items.map((item) => (
                  <View key={item.id} style={styles.list}>
                    <TextTouchable
                      onLongPress={() => {
                        if (!item.checked) {
                          showModalRemoveItem(item.id);
                        }
                      }}
                      onPress={() => {
                        setInfoDialog({ open: true, item });
                      }}>
                      <View>
                        <TextComponent
                          style={item.checked ? styles.itemChecked : styles.textItemList}>
                          {item.name} - {item.quantity} {item.measuredUnit}
                        </TextComponent>
                      </View>
                    </TextTouchable>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScreenContent>

        <ScreenContent style={{ justifyContent: "flex-end", maxHeight: "20%" }}>
          <View style={styles.footer}>
            <TextTouchable
              onPress={() => {
                showModalFinishPurchase();
              }}>
              <View>
                <TextComponent style={styles.textTotal}>
                  Total: {formatMonetary(totalPurchase)}
                </TextComponent>
              </View>
            </TextTouchable>

            <Link href={{ pathname: "/addItems" }} asChild>
              <FAB style={styles.addButton} icon={{ name: "add", color: "white" }} color="green" />
            </Link>
          </View>
        </ScreenContent>
      </Container>

      {infoDialog.open && (
        <ModalMarkItemList
          {...{ infoDialog, setInfoDialog, setLoadItems, totalPurchase, setTotalPurchase }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  itemChecked: {
    fontSize: 20,
    padding: 15,
    textDecorationLine: "line-through",
    color: "#999",
    opacity: 0.5,
  },
  containerList: {
    flex: 1,
    justifyContent: "flex-start",
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  textItemList: {
    fontSize: 20,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  textTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 35,
    padding: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    marginBottom: 35,
    marginRight: 15,
  },
  settingsButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

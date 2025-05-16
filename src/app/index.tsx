import Feather from "@expo/vector-icons/Feather";
import { Divider, FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "theme";
import { useApi } from "~/ApiContext";
import { Container } from "~/components/Container";
import ModalMarkItemList from "~/components/ModalMarkItemList";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { TextTouchable } from "~/components/TextTouchable";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { resetRefresh, setInfoToast } from "~/store/reducers/geral";
import { formatMonetary } from "~/utils/stringUtils";

export default function Home() {
  const dispatch = useDispatch();
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const { geral } = useSelector((state: any) => state);
  const { openModalConfirmation } = useModalConfirmation();
  const { getApi, deleteApi } = useApi();
  const [items, setItems] = useState([]);
  const [loadItems, setLoadItems] = useState(false);
  const [infoDialog, setInfoDialog] = useState({ open: false, item: {} });
  const [totalPurchase, setTotalPurchase] = useState(0);

  const remove = async (idItem: number) => {
    deleteApi(`list-supermarket/${idItem}`);

    dispatch(
      setInfoToast({
        open: true,
        message: "Item removido com sucesso!",
        type: "success",
      })
    );

    setLoadItems(true);
  };

  const finishPurchase = async () => {
    await deleteApi("list-supermarket/finish-purchase");

    dispatch(
      setInfoToast({
        open: true,
        message: "Compra finalizada com sucesso!",
        type: "success",
      })
    );
    setTotalPurchase(0);
    setLoadItems(true);
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
    openModalConfirmation(
      "Deseja finalizar a compra? Todos os itens serão removidos e o valor será zerado",
      () => {
        finishPurchase();
      }
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const results = await getApi("list-supermarket");

      console.log("RESULTS", results);

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

      setItems(results);
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

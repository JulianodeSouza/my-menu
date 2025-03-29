import Feather from "@expo/vector-icons/Feather";
import { Divider, FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import ModalEditItem from "~/components/ModalEditItem";
import ModalMarkItemList from "~/components/ModalMarkItemList";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { TextTouchable } from "~/components/TextTouchable";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { resetRefresh } from "~/store/reducers/geral";
import { formatMonetary } from "~/utils/stringUtils";

export default function Home() {
  const dispatch = useDispatch();
  const { geral } = useSelector((state: any) => state);

  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const [items, setItems] = useState([]);
  const [loadItems, setLoadItems] = useState(false);
  const [infoDialog, setInfoDialog] = useState({ open: false, item: {} });
  const [infoDialogEdit, setInfoDialogEdit] = useState({ open: false, idItem: 0 });
  const [totalPurchase, setTotalPurchase] = useState(0);
  const purchaseListDatabase = useListPurchaseDatabase();

  useEffect(() => {
    const loadData = async () => {
      const results = await purchaseListDatabase.listAllItems();

      console.log(results);

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
      dispatch(resetRefresh());
      loadData();
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
                          setInfoDialogEdit({ open: true, idItem: item.id });
                        }
                      }}
                      onPress={() => {
                        if (!item.checked) {
                          setInfoDialog({ open: true, item });
                        }
                      }}>
                      <View>
                        <TextComponent
                          style={item.checked ? styles.itemChecked : styles.textItemList}>
                          {item.name} ({item.quantity})
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
                console.log("##### finalizar compra");
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

      {infoDialogEdit.open && (
        <ModalEditItem {...{ infoDialogEdit, setInfoDialogEdit, setLoadItems }} />
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

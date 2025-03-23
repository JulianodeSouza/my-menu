import Feather from "@expo/vector-icons/Feather";
import { Divider, FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import ModalEditItem from "~/components/ModalEditItem";
import ModalMarkItemList from "~/components/ModalMarkItemList";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { TextTouchable } from "~/components/TextTouchable";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { formatMonetary } from "~/utils/stringUtils";

export default function Home() {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const [items, setItems] = useState([]);
  const [loadItems, setLoadItems] = useState(false);
  const [infoDialog, setInfoDialog] = useState({ open: false, item: {} });
  const [infoDialogEdit, setInfoDialogEdit] = useState({ open: false, idItem: 0 });
  const [totalPurchase, setTotalPurchase] = useState(0);
  const purchaseListDatabase = useListPurchaseDatabase();

  useEffect(() => {
    const loadData = async () => {
      const items = await purchaseListDatabase.listAllItems();

      const itemsByCategory = [];
      for (const item of items) {
        const categoryAlredayExist = itemsByCategory.find(
          (category) => category.category === item.category
        );

        if (!categoryAlredayExist) {
          const itemList = {
            category: item.category,
            items: [item],
          };

          itemsByCategory.push(itemList);
        } else {
          const index = itemsByCategory.findIndex(
            (category) => category.category === item.category
          );

          itemsByCategory[index].items.push(item);
        }

        setItems(itemsByCategory);
      }
    };

    if (loadItems) {
      setLoadItems(false);
      loadData();
    }
  }, [loadItems]);

  useEffect(() => {
    setLoadItems(true);
  }, []);

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
          <ScrollView>
            {items.map((item) => (
              <View key={item.category}>
                <TextComponent style={styles.title}>{item.category}</TextComponent>

                <Divider />
                {item.items.map((item) => (
                  <View key={item.id} style={styles.list}>
                    <TextTouchable
                      onLongPress={() => {
                        setInfoDialogEdit({ open: true, idItem: item.id });
                      }}
                      onPress={() => {
                        setInfoDialog({ open: true, item });
                      }}>
                      <View>
                        <TextComponent style={styles.textItemList}>
                          - {item.name} - {item.quantity}
                        </TextComponent>
                      </View>
                    </TextTouchable>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScreenContent>

        <ScreenContent style={{ justifyContent: "flex-end" }}>
          <View style={styles.containerButtonAdd}>
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
    textAlign: "center",
    marginBottom: 35,
    padding: 15,
  },
  containerButtonAdd: {
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

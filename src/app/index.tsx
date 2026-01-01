import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "theme";
import { useApi } from "~/ApiContext";
import FloatingButton from "~/components/Buttons/FloatingButton";
import { Container } from "~/components/Container";
import ModalMarkItemList from "~/components/ModalMarkItemList";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import ScrollContent from "~/components/ScrollContent";
import { TextComponent } from "~/components/Text";
import { TextTouchable } from "~/components/TextTouchable";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { setInfoToast } from "~/store/reducers/geral";
import { IListPurchaseView } from "~/types/listPurchase";
import { formatMonetary } from "~/utils/stringUtils";
import { calculateValuesByMeasuredUnits } from "~/utils/sumUtils";

type IDialog = {
  open: boolean;
  item: IListPurchaseView | {};
};

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const { openModalConfirmation } = useModalConfirmation();
  const { getApi, deleteApi, postApi } = useApi();
  const [shoppingList, setItems] = useState<IListPurchaseView[]>([]);
  const [loadItems, setLoadItems] = useState<boolean>(false);
  const [infoDialog, setInfoDialog] = useState<IDialog>({ open: false, item: {} });
  const [totalPurchase, setTotalPurchase] = useState<number>(0);

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
    await postApi("list-supermarket/finish-purchase");

    dispatch(
      setInfoToast({
        open: true,
        message: "Compra finalizada com sucesso!",
        type: "success",
      })
    );
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

  const sumAmountPurchase = (shoppingList: IListPurchaseView[]) => {
    let total = 0;

    for (const shoppingItem of shoppingList) {
      for (const item of shoppingItem.items) {
        if (item.checked && item.amount && item.totalCaught) {
          total += item.amount * item.totalCaught;
        }
      }
    }
    setTotalPurchase(total);
  };

  useEffect(() => {
    const loadData = async () => {
      const results = await getApi("list-supermarket");
      setItems(results);
      sumAmountPurchase(results);
    };

    if (loadItems) {
      setLoadItems(false);
      loadData();
    }
  }, [loadItems]);

  useFocusEffect(
    useCallback(() => {
      setLoadItems(true);
    }, [])
  );

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
          <ScrollContent>
            {shoppingList.length > 0 && (
              <>
                {shoppingList.map((shoppingItem) => (
                  <View key={shoppingItem.category}>
                    <TextComponent style={styles.title}>{shoppingItem.category}</TextComponent>

                    <Divider />
                    {shoppingItem.items.map((item) => (
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
              </>
            )}
          </ScrollContent>
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

            <FloatingButton
              style={styles.addButton}
              color="green"
              onPress={() => {
                router.push("/addItems");
              }}
            />
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

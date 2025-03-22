import Feather from "@expo/vector-icons/Feather";
import { CheckBox, Divider, FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";

export default function Home() {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const [items, setItems] = useState([]);
  const [loadItems, setLoadItems] = useState(false);
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
        <StatusBar barStyle={theme === darkTheme ? "dark-content" : "light-content"} />

        <ScreenContent>
          <Link href={{ pathname: "/settings" }} asChild>
            <Feather name="settings" size={35} color={theme.text} style={styles.settingsButton} />
          </Link>
        </ScreenContent>

        <ScreenContent style={styles.containerList}>
          <ScrollView>
            {items.map((item) => (
              <View key={item.category}>
                <TextComponent style={styles.title}>{item.category}</TextComponent>

                <Divider />
                {item.items.map((item) => (
                  <View key={item.id} style={styles.list}>
                    <CheckBox
                      size={32}
                      checked={item.checked}
                      onPress={() => {
                        purchaseListDatabase.updateCheck(item.id, !item.checked);
                        setLoadItems(true);
                      }}
                      iconType="material-community"
                      checkedIcon="checkbox-outline"
                      uncheckedIcon={"checkbox-blank-outline"}
                    />

                    <TextComponent style={styles.textItemList}>{item.name}</TextComponent>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScreenContent>

        <ScreenContent style={styles.containerButtonAdd}>
          <Link href={{ pathname: "/addItems" }} asChild>
            <FAB style={styles.addButton} icon={{ name: "add", color: "white" }} color="green" />
          </Link>
        </ScreenContent>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  containerList: {
    flex: 1,
    justifyContent: "flex-start",
  },
  list: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  textItemList: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  containerButtonAdd: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
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

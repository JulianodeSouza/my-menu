import { MaterialIcons } from "@expo/vector-icons";
import { Divider, FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useCategoryDatabase } from "~/db/categoryDatabase";
import { resetRefreshCategories, setInfoToast } from "~/store/reducers/geral";

export default function AddItems() {
  const dispatch = useDispatch();
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const { geral } = useSelector((state: any) => state);
  const { openModalConfirmation } = useModalConfirmation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryDatabase = useCategoryDatabase();

  const showDialogToRemove = (idCategory: number) => {
    openModalConfirmation("Deseja remover essa categoria?", async () => {
      remove(idCategory);
    });
  };

  const remove = async (idCategory: number) => {
    await categoryDatabase
      .removeCategory(idCategory)
      .then(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Categoria removida com sucesso!",
            type: "success",
          })
        );
        setLoading(true);
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

  useEffect(() => {
    const loadCategories = async () => {
      const result = await categoryDatabase.listAllCategories();
      setCategories(result);
    };

    if (loading) {
      setLoading(false);
      loadCategories();
      dispatch(resetRefreshCategories());
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, [geral.refreshCategories]);

  return (
    <Container>
      <HeaderScreen headerShown={true} title="Categorias" />

      <ScreenContent style={styles.containerList}>
        <ScrollView style={{ flex: 1, height: "90%" }} showsVerticalScrollIndicator={false}>
          {categories.length === 0 && <TextComponent>Nenhuma categoria encontrada</TextComponent>}

          {categories.length > 0 && (
            <>
              {categories.map((category) => (
                <View key={category.idCategory}>
                  <View style={styles.rowCategory}>
                    <TextComponent style={styles.title}>{category.name}</TextComponent>

                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => {
                          showDialogToRemove(category.idCategory);
                        }}>
                        <MaterialIcons name="delete" size={30} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Divider />
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </ScreenContent>

      <ScreenContent style={{ justifyContent: "flex-end", maxHeight: "20%" }}>
        <View style={styles.footer}>
          <Link href={{ pathname: "/addCategory" }} asChild>
            <FAB style={styles.addButton} icon={{ name: "add", color: "white" }} color="green" />
          </Link>
        </View>
      </ScreenContent>
    </Container>
  );
}
const styles = StyleSheet.create({
  containerList: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    padding: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButton: {
    marginBottom: 35,
    marginRight: 15,
  },
  rowCategory: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

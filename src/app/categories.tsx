import { MaterialIcons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "~/ApiContext";
import FloatingButton from "~/components/Buttons/FloatingButton";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { TextComponent } from "~/components/Text";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useTheme } from "~/contexts/ThemeContext";
import { setInfoToast } from "~/store/reducers/geral";

export default function Categories() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const geral = useSelector((state: any) => state.geral);
  const { openModalConfirmation } = useModalConfirmation();
  const { getApi, deleteApi } = useApi();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const showDialogToRemove = (id_category: number) => {
    openModalConfirmation("Deseja remover essa categoria?", async () => {
      remove(id_category);
    });
  };

  const remove = async (id_category: number) => {
    await deleteApi(`categories/${id_category}`);

    dispatch(
      setInfoToast({
        open: true,
        message: "Categoria removida com sucesso!",
        type: "success",
      })
    );
    setLoading(true);
  };

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getApi("categories");
      setCategories(result);
    };

    if (loading) {
      setLoading(false);
      loadCategories();
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, [geral.refreshCategories]);

  return (
    <Container>
      <HeaderScreen headerShown={true} title="Categorias" />

      <ScreenContent style={styles.containerList}>
        {categories.length === 0 && (
          <TextComponent style={styles.titleWithoutCategories}>
            Nenhuma categoria encontrada
          </TextComponent>
        )}

        {categories.length > 0 && (
          <>
            {categories.map((category) => (
              <View key={category.id_category}>
                <View style={styles.rowCategory}>
                  <TextComponent style={styles.title}>{category.name}</TextComponent>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => {
                        showDialogToRemove(category.id_category);
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
      </ScreenContent>

      <View style={styles.footer}>
        <View style={styles.addButton}>
          <FloatingButton onPress={() => {}} />
        </View>
      </View>
    </Container>
  );
}
const styles = StyleSheet.create({
  containerList: {
    flex: 1,
    justifyContent: "flex-start",
  },
  titleWithoutCategories: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    padding: 10,
  },
  footer: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButton: {
    marginBottom: 15,
    marginRight: 5,
    justifyContent: "flex-end",
    maxHeight: "20%",
  },
  rowCategory: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

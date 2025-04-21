import { Card } from "@rneui/base";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Container } from "~/components/Container";
import FormCategories from "~/components/FormCategories";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useCategoryDatabase } from "~/db/categoryDatabase";
import { setInfoToast, setRefreshCategories } from "~/store/reducers/geral";

export default function AddItems() {
  const dispatch = useDispatch();
  const categoriesDatabase = useCategoryDatabase();
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  };

  const save = async (values) => {
    const data = {
      name: values.name.trim(),
    };

    await categoriesDatabase
      .create(data)
      .then(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Categoria adicionada com sucesso!",
            type: "success",
          })
        );

        dispatch(setRefreshCategories(true));
      })
      .catch(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Houve um erro ao adicionar a categoria!",
            type: "error",
          })
        );
      });
  };

  return (
    <Container>
      <HeaderScreen headerShown={false} />

      <ScreenContent style={sytles.container}>
        <Card containerStyle={sytles.card}>
          <Card.Title>Informe a categoria</Card.Title>
          <Card.Divider />

          <FormCategories {...{ save, navigateBack }} />
        </Card>
      </ScreenContent>
    </Container>
  );
}

const sytles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 20,
    width: "90%",
  },
  buttonSave: { marginVertical: 20 },
});

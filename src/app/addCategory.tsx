import { Card, Divider, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { Container } from "~/components/Container";
import FormCategories from "~/components/FormCategories";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useTheme } from "~/contexts/ThemeContext";
import { setInfoToast } from "~/store/reducers/geral";

export default function AddItems() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { postApi } = useApi();
  const { theme } = useTheme();

  const navigateBack = () => {
    navigation.goBack();
  };

  const save = async (values) => {
    const data = {
      name: values.name.trim(),
    };

    await postApi("categories", data);

    dispatch(
      setInfoToast({
        open: true,
        message: "Categoria adicionada com sucesso!",
        type: "success",
      })
    );
  };

  return (
    <Container>
      <HeaderScreen headerShown={false} />

      <ScreenContent style={sytles.container}>
        <Card style={[sytles.card, { backgroundColor: theme.background }]}>
          <Card.Content>
            <Text style={[sytles.cardTitle, { color: theme.text }]}>Informe a categoria</Text>
            <Divider style={sytles.divider} />

            <FormCategories {...{ save, navigateBack }} />
          </Card.Content>
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
    padding: 10,
    width: "90%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  divider: {
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Card, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { useDispatch } from "react-redux";
import { darkTheme, lightTheme } from "theme";
import { useApi } from "~/ApiContext";
import { Container } from "~/components/Container";
import FormListPurchase from "~/components/FormListPurchase";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { setInfoToast } from "~/store/reducers/geral";
import { formatDecimal } from "~/utils/stringUtils";

export default function AddItems() {
  const { postApi } = useApi();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  const handleClose = () => {
    navigation.goBack();
  };

  const save = async (values) => {
    const data = {
      name: values.name.trim(),
      quantity: formatDecimal(values.quantity),
      category: values.category,
      measuredUnit: values.measuredUnit,
    };

    await postApi("list-supermarket", data);

    dispatch(
      setInfoToast({
        open: true,
        message: "Item adicionado com sucesso!",
        type: "success",
      })
    );
  };

  return (
    <Container>
      <HeaderScreen headerShown={false} />

      <ScreenContent style={sytle.container}>
        <Card style={[sytle.card, { backgroundColor: theme.background }]}>
          <Card.Content>
            <Text style={[sytle.cardTitle, { color: theme.textSecondary }]}>
              Informe os dados do produto
            </Text>

            <FormListPurchase {...{ handleClose, save }} />
          </Card.Content>
        </Card>
      </ScreenContent>
    </Container>
  );
}

const sytle = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 20,
    width: "90%",
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonSave: { marginVertical: 20 },
});

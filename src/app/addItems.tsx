import { Card } from "@rneui/base";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { Container } from "~/components/Container";
import FormListPurchase from "~/components/FormListPurchase";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { setInfoToast, setRefreshItens } from "~/store/reducers/geral";
import { formatDecimal } from "~/utils/stringUtils";

export default function AddItems() {
  const { postApi } = useApi();
  const dispatch = useDispatch();
  const navigation = useNavigation();

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

    dispatch(setRefreshItens(true));
  };

  return (
    <Container>
      <HeaderScreen headerShown={false} />

      <ScreenContent style={sytle.container}>
        <Card containerStyle={sytle.card}>
          <Card.Title>Informe os dados do produto</Card.Title>
          <Card.Divider />

          <FormListPurchase {...{ handleClose, save }} />
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
  buttonSave: { marginVertical: 20 },
});

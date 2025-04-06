import { Card } from "@rneui/base";
import { useNavigation } from "expo-router";
import { Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Container } from "~/components/Container";
import FormListPurchase from "~/components/FormListPurchase";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { setInfoToast, setRefreshItens } from "~/store/reducers/geral";
import { formatDecimal } from "~/utils/stringUtils";

export default function AddItems() {
  const dispatch = useDispatch();
  const purchaseListDatabase = useListPurchaseDatabase();
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

    await purchaseListDatabase
      .create(data)
      .then(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Item adicionado com sucesso!",
            type: "success",
          })
        );

        dispatch(setRefreshItens(true));
      })
      .catch(() => {
        dispatch(
          setInfoToast({
            open: true,
            message: "Houve um erro ao adicionar o item!",
            type: "error",
          })
        );
      });
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

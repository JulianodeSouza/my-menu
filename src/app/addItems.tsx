import { Card } from "@rneui/base";
import { useNavigation } from "expo-router";
import { Alert, StyleSheet } from "react-native";
import { Container } from "~/components/Container";
import FormListPurchase from "~/components/FormListPurchase";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";

export default function AddItems() {
  const purchaseListDatabase = useListPurchaseDatabase();
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.goBack();
  };

  const save = async (values) => {
    await purchaseListDatabase.create({
      name: values.name,
      quantity: Number(values.quantity),
      category: values.category,
    });

    Alert.alert("Sucesso", "Item adicionado com sucesso!");
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

import { Card } from "@rneui/base";
import { useNavigation } from "expo-router";
import { useFormik } from "formik";
import { Alert, StyleSheet } from "react-native";
import { ButtonPrimary } from "~/components/ButtonPrimary";
import { ButtonTextSecondary } from "~/components/ButtonTextSecondary";
import { Container } from "~/components/Container";
import { Input } from "~/components/Input";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import SelectCategories from "~/components/SelectCategories";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";

export default function AddItems() {
  const initialState = { name: "", category: "1", quantity: "" };
  const purchaseListDatabase = useListPurchaseDatabase();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialState,
    onSubmit: async (values) => {
      createItem(values);
    },
  });

  const createItem = async (values) => {
    await purchaseListDatabase.create({
      name: values.name,
      quantity: Number(values.quantity),
      category: values.category,
    });

    Alert.alert("Sucesso", "Item adicionado com sucesso!");
    formik.resetForm();
  };

  return (
    <Container>
      <HeaderScreen headerShown={false} />

      <ScreenContent style={sytle.container}>
        <Card containerStyle={sytle.card}>
          <Card.Title>Informe os dados do produto</Card.Title>
          <Card.Divider />

          <Input
            placeholder="Produto"
            onChangeText={formik.handleChange("name")}
            value={formik.values.name || ""}
          />

          <Input
            placeholder="Quantidade"
            onChangeText={formik.handleChange("quantity")}
            value={formik.values.quantity || ""}
            keyboardType="numeric"
          />

          <SelectCategories
            value={formik.values.category}
            handleChange={(value) => {
              formik.setFieldValue("category", value);
            }}
          />

          <ButtonPrimary
            style={sytle.buttonSave}
            onPress={() => formik.handleSubmit()}
            title="Adicionar"
          />

          <ButtonTextSecondary title="Voltar" onPress={() => navigation.goBack()} />
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

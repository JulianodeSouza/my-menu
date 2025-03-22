import { Picker } from "@react-native-picker/picker";
import { Card } from "@rneui/base";
import { useSQLiteContext } from "expo-sqlite";
import { Formik } from "formik";
import { Alert, StyleSheet } from "react-native";
import { ButtonPrimary } from "~/components/ButtonPrimary";
import { Container } from "~/components/Container";
import { Input } from "~/components/Input";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import ListPurchaseDatabase from "~/db/listPurchaseDatabase";

export default function AddItems() {
  const database = useSQLiteContext(); // Agora o hook está dentro do componente

  const createItem = async (values) => {
    await new ListPurchaseDatabase(database).create({
      name: values.name,
      quantity: Number(values.quantity),
      category: values.category,
    });

    Alert.alert("Sucesso", "Item adicionado com sucesso!");
  };

  return (
    <Container>
      <HeaderScreen title="Adicionar itens" />

      <ScreenContent style={sytle.container}>
        <Formik
          initialValues={{ name: "", category: "bebidas", quantity: "" }}
          onSubmit={(values) => createItem(values)}>
          {({ handleChange, handleSubmit, values, setFieldValue }) => (
            <Card containerStyle={sytle.card}>
              <Card.Title>Informe os dados do produto</Card.Title>
              <Card.Divider />

              <Input
                placeholder="Produto"
                onChangeText={handleChange("name")}
                value={values.name || ""}
              />

              <Input
                placeholder="Quantidade"
                onChangeText={handleChange("quantity")}
                value={values.quantity || ""}
                keyboardType="numeric"
              />

              <Picker
                placeholder="Categoria"
                selectedValue={values.category || ""}
                onValueChange={(itemValue) => setFieldValue("category", itemValue)}>
                <Picker.Item label="Bebidas" value="bebidas" />
                <Picker.Item label="Carnes" value="carnes" />
              </Picker>

              <ButtonPrimary
                style={sytle.buttonSave}
                onPress={() => handleSubmit()}
                title="Adicionar"
              />
            </Card>
          )}
        </Formik>
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
  buttonSave: { marginTop: 10 },
});

import { Picker } from "@react-native-picker/picker";
import { Button, Card } from "@rneui/base";
import { useFormik } from "formik";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { Container } from "~/components/Container";
import { Input } from "~/components/Input";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";

export default function AddItems() {
  const Schema = yup.object().shape({
    name: yup.string().required("Informe o produto"),
    quantity: yup.number().required("informe a quantidade"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      quantity: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      console.log(values);

      // listPurchaseDatabase().create({
      //   name: values.name,
      //   quantity: Number(values.quantity),
      //   category: values.category,
      // });
    },
  });

  return (
    <Container>
      <HeaderScreen title="Adicionar itens" />

      <ScreenContent style={sytle.container}>
        <Card containerStyle={sytle.card}>
          <Input
            placeholder="Produto"
            onChangeText={formik.handleChange("name")}
            value={formik.values.name}
          />

          <Card.Divider />

          <Input
            placeholder="Quantidade"
            onChangeText={formik.handleChange("quantity")}
            value={formik.values.quantity}
            keyboardType="numeric"
          />

          <Card.Divider />

          <Picker
            placeholder="Categoria"
            selectedValue={formik.values.category}
            onValueChange={(itemValue) => formik.setFieldValue("category", itemValue)}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>

          <Button
            onPress={() => {
              formik.handleSubmit();
            }}
            title="Adicionar"
          />
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
    width: "90%",
  },
});

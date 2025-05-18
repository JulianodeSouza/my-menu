import { useFormik } from "formik";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { ButtonTextSecondary } from "~/components/Buttons/ButtonTextSecondary";
import { Input } from "~/components/Input";
import SelectCategories from "~/components/SelectCategories";
import { IListPurchase } from "~/types/listPurchase";
import SelectMeasuredUnits from "./SelectMeasuredUnits";

type PropsForm = {
  save: (values: any) => void;
  handleClose: () => void;
  isEdit?: boolean;
  item?: IListPurchase;
};

export default function FormListPurchase({ save, handleClose }: PropsForm) {
  const initialState = { name: "", category: "1", quantity: "", measuredUnit: "1" };

  const Schema = yup.object().shape({
    name: yup.string().required("Informe o nome do produto"),
    quantity: yup.string().required("Informe a quantidade de itens"),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: Schema,
    onSubmit: async (values) => {
      save(values);
      formik.resetForm();
    },
  });

  return (
    <>
      <Input
        placeholder="Produto *"
        onChangeText={formik.handleChange("name")}
        value={formik.values.name || ""}
        error={formik.touched.name && Boolean(formik.errors.name)}
        textError={formik.errors.name}
        keyboardType="default"
      />

      <Input
        placeholder="Quantidade *"
        onChangeText={formik.handleChange("quantity")}
        value={formik.values.quantity || ""}
        keyboardType="numeric"
        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
        textError={formik.errors.quantity}
      />

      <SelectCategories
        value={formik.values.category}
        handleChange={(value) => {
          formik.setFieldValue("category", value);
        }}
      />

      <SelectMeasuredUnits
        value={formik.values.measuredUnit}
        handleChange={(value) => {
          formik.setFieldValue("measuredUnit", value);
        }}
      />

      <ButtonPrimary
        style={sytle.buttons}
        onPress={() => formik.handleSubmit()}
        title="Adicionar"
      />

      <ButtonTextSecondary
        style={sytle.buttons}
        title="Voltar"
        onPress={() => {
          handleClose();
        }}
      />
    </>
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
  buttons: { marginTop: 20 },
});

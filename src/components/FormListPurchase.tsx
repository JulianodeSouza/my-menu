import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { ButtonPrimary } from "~/components/ButtonPrimary";
import { ButtonTextSecondary } from "~/components/ButtonTextSecondary";
import { Input } from "~/components/Input";
import SelectCategories from "~/components/SelectCategories";
import { IListPurchase } from "~/types/listPurchase";
import { ButtonRemove } from "./ButtonRemove";

type PropsForm = {
  save: (values: any) => void;
  handleClose: () => void;
  isEdit?: boolean;
  item?: IListPurchase;
  remove?: () => void;
};

export default function FormListPurchase({ item, isEdit, save, remove, handleClose }: PropsForm) {
  const initialState = { name: "", category: "1", quantity: "" };
  const [loadData, setLoadData] = useState(false);

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

  useEffect(() => {
    if (loadData && item) {
      setLoadData(false);
      formik.setValues({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
      });
    }
  }, [loadData, item]);

  useEffect(() => {
    setLoadData(true);
  }, []);

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

      <ButtonPrimary
        style={sytle.buttons}
        onPress={() => formik.handleSubmit()}
        title={isEdit ? "Atualizar" : "Adicionar"}
      />

      {isEdit && (
        <ButtonRemove
          style={sytle.buttons}
          onPress={() => {
            remove();
          }}
          title="Excluir"
        />
      )}

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

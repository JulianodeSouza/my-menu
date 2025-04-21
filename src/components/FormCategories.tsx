import { useFormik } from "formik";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { ButtonPrimary } from "~/components/ButtonPrimary";
import { ButtonTextSecondary } from "~/components/ButtonTextSecondary";
import { Input } from "~/components/Input";
import { ICategories } from "~/types/categories";

type PropsForm = {
  save: (values: any) => void;
  navigateBack: () => void;
  isEdit?: boolean;
  item?: ICategories;
};

export default function FormCategories({ save, navigateBack }: PropsForm) {
  const initialState = { name: "" };

  const Schema = yup.object().shape({
    name: yup.string().required("Informe o nome da categoria"),
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
        placeholder="Categoria *"
        onChangeText={formik.handleChange("name")}
        value={formik.values.name || ""}
        error={formik.touched.name && Boolean(formik.errors.name)}
        textError={formik.errors.name}
        keyboardType="default"
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
          navigateBack();
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

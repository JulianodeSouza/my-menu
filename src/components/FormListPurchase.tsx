import { useFormik } from "formik";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { Input } from "~/components/Input";
import SelectCategories from "~/components/Select/SelectCategories";
import { FormValuesProps } from "~/types/formListPurchase";
import { PropsForm } from "~/types/forms";
import { formatMonetary } from "~/utils/stringUtils";
import SelectMeasuredUnits from "./Select/SelectMeasuredUnits";

export default function FormListPurchase({ save, isEdit, item, formMode }: PropsForm) {
  const initialState: FormValuesProps = {
    name: "",
    category: 1,
    quantity: 0,
    measuredUnit: 1,
    totalCaught: 0,
    amount: 0,
  };

  const Schema = yup.object().shape({
    name: yup.string().required("Informe o nome do produto"),
    quantity: yup.string().required("Informe a quantidade total"),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: Schema,
    onSubmit: async (values) => {
      save(values);
    },
  });

  useEffect(() => {
    if ((isEdit || formMode === "mark") && item) {
      const valuesForm: FormValuesProps = {
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        measuredUnit: item.measuredUnit,
        amount: item.amount,
        totalCaught: item.totalCaught,
      };

      formik.setValues(valuesForm);
    }
  }, [isEdit, item, formMode]);

  const textButton = () => {
    if (formMode === "register") {
      return "Adicionar";
    } else if (formMode === "edit") {
      return "Salvar";
    } else if (formMode === "mark") {
      return "Marcar como comprado";
    }
  };

  return (
    <>
      <Input
        readOnly={formMode === "mark"}
        isRequired={formMode === "register"}
        label="Produto"
        placeholder="Digite..."
        onChangeText={formik.handleChange("name")}
        value={formik.values.name || ""}
        error={formik.touched.name && Boolean(formik.errors.name)}
        textError={formik.errors.name}
        keyboardType="default"
      />

      {formMode === "register" && (
        <SelectCategories
          isRequired
          value={formik.values.category}
          handleChange={(value) => {
            formik.setFieldValue("category", value);
          }}
        />
      )}

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: "50%",
        }}>
        <Input
          isRequired
          label="Quantidade"
          placeholder="Digite..."
          onChangeText={formik.handleChange("quantity")}
          value={String(formik.values.quantity) || ""}
          keyboardType="numeric"
          error={formik.touched.quantity && Boolean(formik.errors.quantity)}
          textError={formik.errors.quantity}
        />
        <SelectMeasuredUnits
          isRequired
          value={formik.values.measuredUnit}
          handleChange={(value) => {
            formik.setFieldValue("measuredUnit", value);
          }}
        />
      </View>

      {formMode === "mark" && (
        <Input
          isRequired
          label="Quantidade pega"
          placeholder="Digite..."
          value={String(formik.values.totalCaught) || ""}
          onChangeText={formik.handleChange("totalCaught")}
          keyboardType="numeric"
          error={formik.touched.totalCaught && Boolean(formik.errors.totalCaught)}
          textError={formik.errors.totalCaught}
        />
      )}

      <Input
        isRequired={formMode === "mark"}
        label="Preço Unitário"
        placeholder="R$ 0,00"
        value={String(formik.values.amount) || ""}
        onChangeText={formik.handleChange("amount")}
        keyboardType="numeric"
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        textError={formik.errors.amount}
        mask={(value: string) => {
          return formatMonetary(Number(value));
        }}
      />

      <ButtonPrimary
        style={styles.buttons}
        onPress={() => formik.handleSubmit()}
        title={textButton()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 20,
    width: "90%",
  },
  buttons: { marginTop: 20, elevation: 0 },

  inputContainer: {
    marginVertical: 10,
  },
});

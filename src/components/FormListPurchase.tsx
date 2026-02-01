import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { borderRadius, fontWeights, typography } from "theme";
import * as yup from "yup";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { Input } from "~/components/Input";
import SelectCategories from "~/components/Select/SelectCategories";
import { useTheme } from "~/contexts/ThemeContext";
import { FormValuesProps } from "~/types/formListPurchase";
import { PropsForm } from "~/types/forms";
import { IMeasuredUnit } from "~/types/measuredUnit";
import {
  formatDecimal,
  formatNumberToMonetary,
  maskInputMonetary,
  onlyNumbers,
} from "~/utils/stringUtils";
import { calculateValuesByMeasuredUnits } from "~/utils/sumUtils";
import SelectMeasuredUnits from "./Select/SelectMeasuredUnits";
import { TextComponent } from "./Text";

export default function FormListPurchase({ save, isEdit, item, formMode }: PropsForm) {
  const [previewTotalPurchase, setPreviewTotalPurchase] = useState(0);
  const { theme } = useTheme();

  const initialState: FormValuesProps = {
    name: "",
    category: 1,
    quantity: 0,
    measuredUnit: 1,
    totalCaught: 0,
    amount: 0,
  };

  const Schema = yup.object().shape(
    {
      name: yup.string().required("Informe o produto"),
      quantity: yup.string().required("Informe a quantidade"),
      amount: yup.number().when("$formMode", {
        is: "mark",
        then: () => yup.number().required("Informe o preço do produto"),
      }),
      totalCaught: yup.number().when("$formMode", {
        is: "mark",
        then: () => yup.number().required("Informe a quantidade pega"),
      }),
    },
    [["$formMode", formMode]]
  );

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: Schema,
    onSubmit: async (values) => {
      // Remove mask from amount and convert to number
      const amountValue = onlyNumbers(String(values.amount));
      const amountNumber = amountValue ? parseInt(amountValue, 10) / 100 : 0;

      const valuesFormatted: FormValuesProps = {
        ...values,
        quantity: formatDecimal(values.quantity) || 0,
        totalCaught: formatDecimal(values.totalCaught) || 0,
        amount: amountNumber,
      };

      save(valuesFormatted);
    },
  });

  useEffect(() => {
    if ((isEdit || formMode === "mark") && item) {
      const valuesForm: FormValuesProps = {
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity || 0,
        measuredUnit: item.measuredUnit,
        amount: item.amount,
        totalCaught: item.totalCaught || 0,
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
      return "Marcar Item";
    }
  };

  useEffect(() => {
    const calculatePreviewTotal = async () => {
      const quantity = formatDecimal(formik.values.totalCaught || formik.values.quantity);
      const amountValue = onlyNumbers(String(formik.values.amount));
      const amountNumber = amountValue ? parseInt(amountValue, 10) / 100 : 0;
      const measuredUnitCache: IMeasuredUnit[] = JSON.parse(
        await AsyncStorage.getItem("measuredUnits")
      );
      const measuredUnit: IMeasuredUnit = measuredUnitCache.find(
        (unit) => unit.id === formik.values.measuredUnit
      );

      const total = calculateValuesByMeasuredUnits(amountNumber, quantity, measuredUnit.unitSymbol);

      setPreviewTotalPurchase(total);
    };

    calculatePreviewTotal();
  }, [
    formik.values.quantity,
    formik.values.totalCaught,
    formik.values.amount,
    formik.values.measuredUnit,
  ]);

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
          readOnly={formMode === "mark"}
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
        <>
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
              return maskInputMonetary(Number(value));
            }}
          />

          <View style={[styles.containerTotal, { backgroundColor: theme.primaryOpacity10 }]}>
            <TextComponent style={styles.textTotal}>Total:</TextComponent>
            <TextComponent style={styles.textTotal}>
              {formatNumberToMonetary(previewTotalPurchase)}
            </TextComponent>
          </View>
        </>
      )}

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
  containerTotal: {
    width: "100%",
    borderRadius: borderRadius.base,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  textTotal: {
    padding: 10,
    fontWeight: fontWeights.bold,
    fontSize: typography.fontSizeLg,
  },
});

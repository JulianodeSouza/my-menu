import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFormik } from "formik";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import * as yup from "yup";
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
import { borderRadius, fontWeights, spacing, typography } from "../../theme";
import SelectMeasuredUnits from "./Select/SelectMeasuredUnits";
import { TextComponent } from "./Text";

export interface FormListPurchaseRef {
  submit: () => Promise<void>;
}

export default forwardRef<FormListPurchaseRef, PropsForm>(function FormListPurchase(
  { save, isEdit, item, formMode, secondaryAction }: PropsForm,
  ref
) {
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

  const Schema = useMemo(
    () =>
      yup.object().shape(
        {
          name: yup
            .string()
            .typeError("Informe o produto")
            .required("Informe o produto")
            .min(1, "Informe o produto"),
          category: yup
            .number()
            .typeError("Selecione uma categoria")
            .required("Selecione uma categoria")
            .positive("Selecione uma categoria válida"),
          quantity: yup
            .number()
            .typeError("Informe a quantidade")
            .required("Informe a quantidade")
            .positive("A quantidade deve ser maior que zero"),
          measuredUnit: yup
            .number()
            .typeError("Selecione a unidade de medida")
            .required("Selecione a unidade de medida")
            .positive("Selecione uma unidade de medida válida"),
          amount: yup.number().when("$formMode", {
            is: "edit",
            then: () =>
              yup
                .number()
                .typeError("Informe o preço do produto")
                .required("Informe o preço do produto")
                .min(0.01, "O preço deve ser maior que zero"),
            otherwise: () => yup.number(),
          }),
          totalCaught: yup.number().when("$formMode", {
            is: "edit",
            then: () =>
              yup
                .number()
                .typeError("Informe a quantidade pega")
                .required("Informe a quantidade pega")
                .min(0.01, "A quantidade pega deve ser maior que zero"),
            otherwise: () => yup.number(),
          }),
        },
        [["$formMode", formMode]]
      ),
    [formMode]
  );

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
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

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        await formik.setTouched({
          name: true,
          category: true,
          quantity: true,
          measuredUnit: true,
          amount: true,
          totalCaught: true,
        });
        const errors = await formik.validateForm();

        // Se não houver erros, faz o submit
        if (Object.keys(errors).length === 0) {
          formik.handleSubmit();
        }
      },
    }),
    [formik]
  );

  useEffect(() => {
    if (isEdit && item) {
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

  const handleCategoryChange = useCallback((value: number) => {
    formik.setFieldValue("category", value);
    formik.setFieldTouched("category", true);
  }, []);

  const handleMeasuredUnitChange = useCallback((value: number) => {
    formik.setFieldValue("measuredUnit", value);
    formik.setFieldTouched("measuredUnit", true);
  }, []);

  useEffect(() => {
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      Keyboard.dismiss();
    });

    return () => {
      keyboardWillHide.remove();
    };
  }, []);

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
        isRequired={true}
        label="Produto"
        placeholder="Digite..."
        onChangeText={formik.handleChange("name")}
        onBlur={() => formik.setFieldTouched("name", true)}
        value={formik.values.name || ""}
        error={formik.touched.name && Boolean(formik.errors.name)}
        textError={formik.errors.name}
        keyboardType="default"
      />

      <SelectCategories
        isRequired
        value={formik.values.category}
        handleChange={handleCategoryChange}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: "100%",
        }}>
        <View style={{ flex: 1 }}>
          <Input
            isRequired
            label="Quantidade"
            placeholder="Digite..."
            onChangeText={formik.handleChange("quantity")}
            onBlur={() => formik.setFieldTouched("quantity", true)}
            value={String(formik.values.quantity) || ""}
            keyboardType="numeric"
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            textError={formik.errors.quantity}
          />
        </View>
        <View style={{ flex: 1 }}>
          <SelectMeasuredUnits
            isRequired
            value={formik.values.measuredUnit}
            handleChange={handleMeasuredUnitChange}
          />
        </View>
      </View>

      {formMode === "edit" && (
        <>
          <Input
            label="Quantidade pega"
            placeholder="Digite..."
            value={String(formik.values.totalCaught) || ""}
            onChangeText={formik.handleChange("totalCaught")}
            onBlur={() => formik.setFieldTouched("totalCaught", true)}
            keyboardType="numeric"
            error={formik.touched.totalCaught && Boolean(formik.errors.totalCaught)}
            textError={formik.errors.totalCaught}
          />

          <Input
            isRequired={formMode === "edit"}
            label="Preço Unitário"
            placeholder="R$ 0,00"
            value={String(formik.values.amount) || ""}
            onChangeText={formik.handleChange("amount")}
            onBlur={() => formik.setFieldTouched("amount", true)}
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
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 20,
    width: "90%",
  },
  buttons: {
    elevation: 0,
  },
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
    marginTop: spacing.base,
  },
  textTotal: {
    padding: 10,
    fontWeight: fontWeights.bold,
    fontSize: typography.fontSizeLg,
  },
});

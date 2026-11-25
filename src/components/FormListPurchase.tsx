import { useFormik } from "formik";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import * as yup from "yup";
import { Input } from "~/components/Input";
import SelectCategories from "~/components/Select/SelectCategories";
import { useTheme } from "~/contexts/ThemeContext";
import { FormValuesProps } from "~/types/formListPurchase";
import { PropsForm } from "~/types/forms";
import { IMeasuredUnit } from "~/types/measuredUnit";
import { loadMeasuredUnits } from "~/utils/cacheFunctions";
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
  submit: () => Promise<boolean>;
  reset: () => void;
}

type FormInternalValues = Omit<FormValuesProps, "quantity" | "totalCaught" | "amount"> & {
  quantity: number | string;
  totalCaught?: number | string;
  amount?: number | string;
};

export default forwardRef<FormListPurchaseRef, PropsForm>(function FormListPurchase(
  { save, isEdit, item, formMode }: PropsForm,
  ref
) {
  const [measuredUnits, setMeasuredUnits] = useState<IMeasuredUnit[]>([]);
  const submitSuccessRef = useRef(false);
  const { theme } = useTheme();

  const initialState: FormInternalValues = {
    name: "",
    category: 0,
    quantity: 0,
    measuredUnit: 0,
    totalCaught: 0,
    amount: "",
  };

  const Schema = useMemo(() => {
    const isEditMode = formMode === "edit";

    return yup.object().shape({
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
        .transform((value, originalValue) => {
          if (originalValue === "" || originalValue === null || originalValue === undefined) {
            return undefined;
          }
          return typeof originalValue === "string"
            ? Number(originalValue.replace(",", "."))
            : value;
        })
        .typeError("Informe a quantidade")
        .required("Informe a quantidade")
        .positive("A quantidade deve ser maior que zero"),
      measuredUnit: yup
        .number()
        .typeError("Selecione a unidade de medida")
        .required("Selecione a unidade de medida")
        .positive("Selecione uma unidade de medida válida"),
      amount: isEditMode
        ? yup
          .number()
          .transform((_value, originalValue) => {
            if (originalValue === "" || originalValue === null || originalValue === undefined) {
              return undefined;
            }
            const digits = onlyNumbers(String(originalValue));
            if (!digits) return undefined;
            return parseInt(digits, 10) / 100;
          })
          .typeError("Informe o preço do produto")
          .required("Informe o preço do produto")
          .min(0.01, "O preço deve ser maior que zero")
        : yup.mixed().notRequired(),
      totalCaught: isEditMode
        ? yup
          .number()
          .transform((value, originalValue) => {
            if (originalValue === "" || originalValue === null || originalValue === undefined) {
              return undefined;
            }
            return typeof originalValue === "string"
              ? Number(originalValue.replace(",", "."))
              : value;
          })
          .typeError("Informe a quantidade pega")
          .required("Informe a quantidade pega")
          .min(0.01, "A quantidade pega deve ser maior que zero")
        : yup.mixed().notRequired(),
    });
  }, [formMode]);

  const formik = useFormik<FormInternalValues>({
    initialValues: initialState,
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      // Remove mask from amount and convert to number
      const amountValue = onlyNumbers(String(values.amount ?? ""));
      const amountNumber = amountValue ? parseInt(amountValue, 10) / 100 : 0;

      const valuesFormatted: FormValuesProps = {
        ...values,
        quantity: formatDecimal(values.quantity) || 0,
        totalCaught: formatDecimal(values.totalCaught ?? 0) || 0,
        amount: amountNumber,
      };

      const result = await save(valuesFormatted);
      submitSuccessRef.current = result !== false;
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        submitSuccessRef.current = false;
        await formik.setTouched(
          {
            name: true,
            category: true,
            quantity: true,
            measuredUnit: true,
            amount: true,
            totalCaught: true,
          },
          false
        );
        const errors = await formik.validateForm();

        // Se não houver erros, faz o submit
        if (Object.keys(errors).length === 0) {
          try {
            await formik.submitForm();
            return submitSuccessRef.current;
          } catch {
            return false;
          }
        }

        return false;
      },
      reset: () => formik.resetForm(),
    }),
    [formik]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchUnits = async () => {
      const units = await loadMeasuredUnits();
      if (isMounted) {
        setMeasuredUnits(units);
      }
    };

    fetchUnits();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isEdit && item) {
      const numericAmount = Number(item.amount) || 0;
      const amountInCents = numericAmount > 0 ? String(Math.round(numericAmount * 100)) : "";

      const valuesForm: FormInternalValues = {
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity || 0,
        measuredUnit: item.measuredUnit,
        amount: amountInCents,
        totalCaught: item.totalCaught || 0,
      };

      formik.setValues(valuesForm);
    }
  }, [isEdit, item, formMode]);

  const handleCategoryChange = useCallback(
    async (value: number) => {
      await formik.setFieldValue("category", value, false);
      await formik.setFieldTouched("category", true, true);
    },
    [formik]
  );

  const handleMeasuredUnitChange = useCallback(
    async (value: number) => {
      await formik.setFieldValue("measuredUnit", value, false);
      await formik.setFieldTouched("measuredUnit", true, true);
    },
    [formik]
  );

  const handleMonetaryMask = useCallback((value: string) => {
    return maskInputMonetary(value);
  }, []);

  useEffect(() => {
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      Keyboard.dismiss();
    });

    return () => {
      keyboardWillHide.remove();
    };
  }, []);

  const previewTotalPurchase = useMemo(() => {
    const quantity =
      formMode === "edit"
        ? formatDecimal(formik.values.totalCaught ?? 0)
        : formatDecimal(formik.values.quantity);

    const amountValue = onlyNumbers(String(formik.values.amount ?? ""));
    const amountNumber = amountValue ? parseInt(amountValue, 10) / 100 : 0;

    const measuredUnit = measuredUnits.find(
      (unit) => Number(unit.id) === Number(formik.values.measuredUnit)
    );
    const unitSymbol = measuredUnit?.unitSymbol ?? item?.unitSymbol;

    return calculateValuesByMeasuredUnits(amountNumber, quantity, unitSymbol);
  }, [
    formMode,
    formik.values.quantity,
    formik.values.totalCaught,
    formik.values.amount,
    formik.values.measuredUnit,
    measuredUnits,
    item?.unitSymbol,
  ]);

  return (
    <>
      <Input
        isRequired={true}
        label="Produto"
        testID="shoplist-form-input-name"
        placeholder="Digite..."
        onChangeText={formik.handleChange("name")}
        onBlur={() => formik.setFieldTouched("name", true)}
        value={formik.values.name || ""}
        error={formik.touched.name && Boolean(formik.errors.name)}
        textError={formik.errors.name}
        keyboardType="default"
      />

      <SelectCategories
        testID="shoplist-form-select-category"
        isRequired
        value={String(formik.values.category)}
        handleChange={handleCategoryChange}
        error={formik.touched.category && Boolean(formik.errors.category)}
        textError={formik.errors.category}
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
            testID="shoplist-form-input-quantity"
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
            testID="shoplist-form-select-unit"
            isRequired
            value={String(formik.values.measuredUnit)}
            handleChange={handleMeasuredUnitChange}
            error={formik.touched.measuredUnit && Boolean(formik.errors.measuredUnit)}
            textError={formik.errors.measuredUnit}
          />
        </View>
      </View>

      {formMode === "edit" && (
        <>
          <Input
            isRequired={formMode === "edit"}
            label="Quantidade pega"
            testID="shoplist-form-input-total-caught"
            placeholder="Digite..."
            value={
              formik.values.totalCaught !== undefined && formik.values.totalCaught !== null
                ? String(formik.values.totalCaught)
                : ""
            }
            onChangeText={formik.handleChange("totalCaught")}
            onBlur={() => formik.setFieldTouched("totalCaught", true)}
            keyboardType="numeric"
            error={formik.touched.totalCaught && Boolean(formik.errors.totalCaught)}
            textError={formik.errors.totalCaught}
          />

          <Input
            isRequired={formMode === "edit"}
            label="Preço Unitário"
            testID="shoplist-form-input-amount"
            placeholder="R$ 0,00"
            value={
              formik.values.amount !== undefined && formik.values.amount !== null
                ? String(formik.values.amount)
                : ""
            }
            onChangeText={formik.handleChange("amount")}
            onBlur={() => formik.setFieldTouched("amount", true)}
            keyboardType="numeric"
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            textError={formik.errors.amount}
            mask={handleMonetaryMask}
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
    marginBottom: spacing.base,
  },
  textTotal: {
    padding: 10,
    fontWeight: fontWeights.bold,
    fontSize: typography.fontSizeLg,
  },
});

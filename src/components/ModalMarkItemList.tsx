import { useFormik } from "formik";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { setInfoToast } from "~/store/reducers/geral";
import { formatDecimal, formatMonetary } from "~/utils/stringUtils";
import { ButtonPrimary } from "./Buttons/ButtonPrimary";
import { ButtonTextSecondary } from "./Buttons/ButtonTextSecondary";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { TextComponent } from "./Text";
import { useApi } from "~/ApiContext";

export default function ModalMarkItemList({
  infoDialog,
  setInfoDialog,
  setLoadItems,
  totalPurchase,
  setTotalPurchase,
}) {
  const dispatch = useDispatch();
  const { postApi, getApi } = useApi();

  const initialValues = {
    totalCaught: "",
    amount: "",
  };

  const Schema = Yup.object().shape({
    totalCaught: Yup.number().required("Informe a quantidade de itens"),
    amount: Yup.string().required("Informe o valor"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Schema,
    onSubmit: async (values) => {
      const data = {
        checked: !infoDialog.item.checked,
        totalCaught: Number(values.totalCaught),
        amount: formatDecimal(values.amount),
      };

      calculateTotal(values, infoDialog.item.checked);
      await postApi(`list-supermarket/mark-item/${infoDialog.item.id}`, data);

      dispatch(
        setInfoToast({
          open: true,
          message: !data.checked ? "Item desmarcado com sucesso!" : "Item marcado com sucesso!",
          type: "success",
        })
      );

      handleClose();
    },
  });

  const calculateTotal = (values: typeof initialValues, checked: boolean) => {
    const totalCaught = Number(values.totalCaught);
    const amount = formatDecimal(values.amount);
    const totalItem = Number(totalCaught) * Number(amount);

    let total = 0;

    if (!checked) {
      total = totalPurchase + totalItem;
    } else {
      total = totalPurchase - totalItem;
    }

    setTotalPurchase(total);
  };

  const handleClose = () => {
    setLoadItems(true);
    setInfoDialog({ open: false });
  };

  useEffect(() => {
    const checkValuesMarked = async () => {
      const item = await getApi(`list-supermarket/item/${infoDialog.item.id}`);

      formik.setFieldValue("totalCaught", item.totalCaught.toString());
      formik.setFieldValue("amount", formatMonetary(item.amount).toString());
    };

    if (!!infoDialog.open && infoDialog.item.checked) {
      checkValuesMarked();
    }
  }, [infoDialog.open, infoDialog.item.checked]);

  return (
    <Modal visible={infoDialog.open} setVisible={setInfoDialog}>
      <TextComponent style={styles.title}>{infoDialog.item.name}</TextComponent>

      <Input
        placeholder="Quantidade *"
        onChangeText={formik.handleChange("totalCaught")}
        value={formik.values.totalCaught}
        keyboardType="numeric"
        error={formik.touched.totalCaught && Boolean(formik.errors.totalCaught)}
        textError={formik.errors.totalCaught}
      />

      <Input
        placeholder="Valor *"
        value={formik.values.amount}
        onChangeText={formik.handleChange("amount")}
        keyboardType="numeric"
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        textError={formik.errors.amount}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ButtonTextSecondary title="Fechar" onPress={handleClose} />
        <ButtonPrimary
          title={infoDialog.item.checked ? "Desmarcar" : "Marcar"}
          onPress={() => formik.handleSubmit()}
          style={{ width: "50%" }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
});

import { useFormik } from "formik";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonTextSecondary } from "./ButtonTextSecondary";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { TextComponent } from "./Text";

export default function ModalMarkItemList({
  infoDialog,
  setInfoDialog,
  setLoadItems,
  totalPurchase,
  setTotalPurchase,
}) {
  const initialValues = {
    quantity: "",
    amount: "",
  };
  const purchaseListDatabase = useListPurchaseDatabase();

  const Schema = Yup.object().shape({
    quantity: Yup.number().required("Informe a quantidade de itens"),
    amount: Yup.string().required("Informe o valor"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Schema,
    onSubmit: async (values) => {
      calculateTotal(values);

      // await purchaseListDatabase.updateCheck(infoDialog.item.id, !infoDialog.item.checked);
      setLoadItems(true);
      handleClose();
    },
  });

  const calculateTotal = (values: typeof initialValues) => {
    const quantity = Number(values.quantity);
    const amount = Number(values.amount.replace(",", "."));

    const totalItem = Number(quantity) * Number(amount);

    const total = totalPurchase + totalItem;
    setTotalPurchase(total);
  };

  const handleClose = () => {
    setInfoDialog({ open: false });
  };

  return (
    <Modal visible={infoDialog.open} setVisible={setInfoDialog} style={styles.overlay}>
      <TextComponent style={styles.title}>{infoDialog.item.name}</TextComponent>

      <Input
        placeholder="Quantidade *"
        onChangeText={formik.handleChange("quantity")}
        value={formik.values.quantity || ""}
        keyboardType="numeric"
        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
        textError={formik.errors.quantity}
      />

      <Input
        placeholder="Valor *"
        value={formik.values.amount || ""}
        onChangeText={formik.handleChange("amount")}
        keyboardType="numeric"
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        textError={formik.errors.amount}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ButtonTextSecondary title="Fechar" onPress={handleClose} />
        <ButtonPrimary
          title="Marcar"
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
  overlay: {
    padding: 20,
    width: "80%",
  },
});

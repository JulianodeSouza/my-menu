import { useFormik } from "formik";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { setInfoToast } from "~/store/reducers/geral";
import { formatDecimal, formatMonetary } from "~/utils/stringUtils";
import { ButtonPrimary } from "./Buttons/ButtonPrimary";
import { ButtonTextSecondary } from "./Buttons/ButtonTextSecondary";
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
  const purchaseListDatabase = useListPurchaseDatabase();
  const dispatch = useDispatch();

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
        itemChecked: !infoDialog.item.checked,
        totalCaught: Number(values.totalCaught),
        amount: formatDecimal(values.amount),
      };

      calculateTotal(values, infoDialog.item.checked);
      await purchaseListDatabase
        .markItemList(infoDialog.item.id, data)
        .then(() => {
          const message = infoDialog.item.checked
            ? "Item desmarcado com sucesso!"
            : "Item marcado com sucesso!";

          dispatch(
            setInfoToast({
              open: true,
              message: message,
              type: "success",
            })
          );
        })
        .catch((error) => {
          console.error("Error updating item:", error);
          dispatch(
            setInfoToast({
              open: true,
              message: "Erro ao atualizar item",
              type: "error",
            })
          );
        });
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
      await purchaseListDatabase
        .getItemById(infoDialog.item.id)
        .then((item) => {
          if (item.totalCaught && item.amount) {
            formik.setFieldValue("totalCaught", item.totalCaught.toString());
            formik.setFieldValue("amount", formatMonetary(item.amount).toString());
          }
        })
        .catch((error) => {
          console.error(error);
          dispatch(
            setInfoToast({
              open: true,
              message: "Erro ao atualizar item",
              type: "error",
            })
          );
        });
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

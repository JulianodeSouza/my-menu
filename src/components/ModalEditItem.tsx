import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useListPurchaseDatabase } from "~/db/listPurchaseDatabase";
import { ListPurchase } from "~/types/listPurchase";
import FormListPurchase from "./FormListPurchase";
import { Modal } from "./Modal";
import { TextComponent } from "./Text";

export default function ModalEditItem({ infoDialogEdit, setInfoDialogEdit, setLoadItems }) {
  const purchaseListDatabase = useListPurchaseDatabase();
  const [item, setItem] = useState<ListPurchase>();
  const [loadData, setLoadData] = useState(false);

  const handleClose = () => {
    setInfoDialogEdit({ open: false });
  };

  const save = async (values) => {
    const data = {
      name: values.name,
      quantity: Number(values.quantity),
      category: values.category,
    };

    await purchaseListDatabase.updateItem(infoDialogEdit.idItem, data);
    setLoadItems(true);
    handleClose();
  };

  const remove = async () => {
    await purchaseListDatabase.removeItem(infoDialogEdit.idItem);
  };

  useEffect(() => {
    const getItemById = async () => {
      const result = await purchaseListDatabase.getItemById(infoDialogEdit.idItem);
      setItem(result);
    };

    if (loadData) {
      setLoadData(false);
      getItemById();
    }
  }, [loadData]);

  useEffect(() => {
    setLoadData(true);
  }, []);

  return (
    <Modal visible={infoDialogEdit.open} setVisible={setInfoDialogEdit} style={styles.overlay}>
      <TextComponent style={styles.title}>Edição {item ? item.name : ""}</TextComponent>

      {item && <FormListPurchase {...{ handleClose, save, item, remove, isEdit: true }} />}
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

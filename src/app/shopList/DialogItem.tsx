import FormListPurchase from "~/components/FormListPurchase";
import { SheetModal } from "~/components/SheetModal";
import { IListPurchase } from "~/types/shopList";

type DialogItemProps = {
  infoDialog: {
    open: boolean;
    item?: IListPurchase;
  };
  onClose: (values?: IListPurchase) => void;
  handleActionForm: (values: IListPurchase, mode: "edit" | "mark" | "register") => void;
  isEdit?: boolean;
  title: string;
  mode: "edit" | "mark" | "register";
};

export default function DialogItem({
  infoDialog,
  isEdit,
  onClose,
  title,
  mode,
  handleActionForm,
}: DialogItemProps) {
  const handleAction = (values: IListPurchase) => {
    const item = values;

    if (!values) {
      return;
    }

    handleActionForm(item, mode);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <SheetModal visible={infoDialog.open} onClose={handleClose} title={title}>
      <FormListPurchase
        save={handleAction}
        isEdit={isEdit}
        item={infoDialog?.item}
        formMode={mode}
      />
    </SheetModal>
  );
}

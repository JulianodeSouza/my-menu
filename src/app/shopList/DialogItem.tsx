import { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { ButtonSecondary } from "~/components/Buttons/ButtonSecondary";
import FormListPurchase, { FormListPurchaseRef } from "~/components/FormListPurchase";
import { SheetModal } from "~/components/SheetModal";
import { setInfoToast } from "~/store/reducers/geral";
import { IListPurchase } from "~/types/shopList";
import { spacing } from "../../../theme";

type DialogItemProps = {
  infoDialog: {
    open: boolean;
    item?: IListPurchase;
  };
  onClose: (values?: IListPurchase) => void;
  handleActionForm: (
    values: IListPurchase,
    mode: "edit" | "mark" | "register"
  ) => void | Promise<void>;
  isEdit?: boolean;
  title: string;
  mode: "edit" | "register";
};

export default function DialogItem({
  infoDialog,
  isEdit,
  onClose,
  title,
  mode,
  handleActionForm,
}: DialogItemProps) {
  const formRef = useRef<FormListPurchaseRef>(null);
  const dispatch = useDispatch();

  const handleAction = useCallback(
    async (values: IListPurchase) => {
      if (!values) return;
      await handleActionForm(values, mode);
    },
    [mode, handleActionForm]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSecondaryAction = useCallback(async () => {
    dispatch(setInfoToast({ position: "top" }));
    const saved = await formRef.current?.submit();

    if (saved && mode === "register") {
      formRef.current?.reset();
    }
  }, [dispatch, mode]);

  const handlePrimaryAction = useCallback(async () => {
    dispatch(setInfoToast({ position: "bottom" }));
    const saved = await formRef.current?.submit();

    if (saved) {
      onClose();
    }
  }, [onClose]);

  const getButtonTexts = useCallback(() => {
    if (mode === "register") {
      return { primary: "Salvar", secondary: "Salvar e continuar" };
    } else if (mode === "edit") {
      return { primary: "Marcar item", secondary: "Editar e continuar" };
    }
    return { primary: "Salvar", secondary: "Continuar" };
  }, [mode]);

  return (
    <SheetModal visible={infoDialog.open} onClose={handleClose} title={title}>
      <View style={styles.container}>
        <FormListPurchase
          ref={formRef}
          save={handleAction}
          isEdit={isEdit}
          item={infoDialog?.item}
          formMode={mode}
        />
        <View style={styles.footerButtons}>
          <View style={styles.buttonWrapper}>
            <ButtonSecondary onPress={handleSecondaryAction} title={getButtonTexts().secondary} />
          </View>
          <View style={styles.buttonWrapper}>
            <ButtonPrimary
              onPress={handlePrimaryAction}
              title={getButtonTexts().primary}
            />
          </View>
        </View>
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  footerButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.base,
    paddingBottom: spacing.base,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    flexShrink: 0,
  },
  buttonWrapper: {
    flex: 1,
  },
});

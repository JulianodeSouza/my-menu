import { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { ButtonText } from "~/components/Buttons/ButtonText";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useTheme } from "~/contexts/ThemeContext";
import { removeItemCache } from "~/services/cache";
import { IMeasuredUnit } from "~/types/measuredUnit";
import { loadMeasuredUnits } from "~/utils/cacheFunctions";
import { setInfoToast } from "~/store/reducers/geral";
import { borderRadius, fontWeights, spacing, typography } from "../../../theme";

export default function MeasuredUnits() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { postApi, putApi, deleteApi } = useApi();
  const confirmationModal = useModalConfirmation();
  const [units, setUnits] = useState<IMeasuredUnit[]>([]);
  const [editingUnit, setEditingUnit] = useState<IMeasuredUnit | null>(null);
  const [name, setName] = useState("");
  const [unitSymbol, setUnitSymbol] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    setUnits(await loadMeasuredUnits());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingUnit(null);
    setName("");
    setUnitSymbol("");
    setModalVisible(true);
  };

  const openEdit = (unit: IMeasuredUnit) => {
    setEditingUnit(unit);
    setName(unit.name);
    setUnitSymbol(unit.unitSymbol);
    setModalVisible(true);
  };

  const saveUnit = async () => {
    const trimmedName = name.trim();
    const trimmedSymbol = unitSymbol.trim();
    if (!trimmedName || !trimmedSymbol) return;

    const data = { name: trimmedName, unitSymbol: trimmedSymbol };
    if (editingUnit) {
      await putApi(`measuredUnits/${editingUnit.id}`, data);
    } else {
      await postApi("measuredUnits", data);
    }

    await removeItemCache("measuredUnits");
    setModalVisible(false);
    await loadData();
    dispatch(
      setInfoToast({
        open: true,
        message: editingUnit
          ? "Unidade atualizada com sucesso"
          : "Unidade adicionada com sucesso",
        type: "success",
      })
    );
  };

  const removeUnit = (unit: IMeasuredUnit) => {
    confirmationModal.openModalConfirmation(
      `Deseja excluir a unidade "${unit.name}"?`,
      async () => {
        await deleteApi(`measuredUnits/${unit.id}`);
        await removeItemCache("measuredUnits");
        await loadData();
        dispatch(
          setInfoToast({
            open: true,
            message: "Unidade removida com sucesso",
            type: "success",
          })
        );
      }
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={[styles.icon, { backgroundColor: theme.primaryOpacity10 }]}>
            <Icon name="Ruler" color={theme.primary} />
          </View>
          <View style={styles.titleTexts}>
            <TextComponent style={styles.title}>Unidades de medida</TextComponent>
            <TextComponent style={styles.subtitle}>Defina como seus produtos são medidos</TextComponent>
          </View>
          <ButtonText title="Adicionar" iconStart="Plus" onPress={openCreate} />
        </View>
        <View style={styles.listContainer}>
          <View style={{ flex: 1 }}>
            <TextComponent style={styles.title}>Unidades de medida</TextComponent>
            <TextComponent style={styles.subtitle}>{units.length} unidades</TextComponent>
            {units.map((unit) => (
              <View
                key={unit.id}
                style={[styles.item, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <View style={styles.itemInfo}>
                  <TextComponent style={styles.itemName}>{unit.name}</TextComponent>
                  <TextComponent style={styles.symbol}>({unit.unitSymbol})</TextComponent>
                </View>
                <View style={styles.actions}>
                  <ButtonText title="" iconStart="Pen" iconSize={18} onPress={() => openEdit(unit)} />
                  <ButtonText
                    title=""
                    iconStart="Trash2"
                    iconSize={18}
                    iconColor={theme.error}
                    onPress={() => removeUnit(unit)}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: theme.background }]}>
            <TextComponent style={styles.modalTitle}>
              {editingUnit ? "Editar unidade" : "Adicionar unidade"}
            </TextComponent>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nome da unidade"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              autoFocus
            />
            <TextInput
              value={unitSymbol}
              onChangeText={setUnitSymbol}
              placeholder="Símbolo (ex.: kg)"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            />
            <View style={styles.modalActions}>
              <ButtonText title="Cancelar" onPress={() => setModalVisible(false)} />
              <ButtonPrimary title="Salvar" onPress={saveUnit} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, marginVertical: spacing.lg },
  titleContainer: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  icon: { padding: spacing.sm, borderRadius: borderRadius.xl },
  titleTexts: { flex: 1 },
  title: { fontSize: typography.fontSizeLg, fontWeight: fontWeights.bold },
  subtitle: { fontSize: typography.fontSizeSm, opacity: 0.7 },
  listContainer: { flexDirection: "row", justifyContent: "space-between", padding: spacing.xs },
  item: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  itemInfo: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  itemName: { fontSize: typography.fontSizeBase, fontWeight: fontWeights.medium },
  symbol: { fontSize: typography.fontSizeSm, opacity: 0.7 },
  actions: { flexDirection: "row" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: { borderRadius: borderRadius.md, padding: spacing.lg, gap: spacing.md },
  modalTitle: { fontSize: typography.fontSizeLg, fontWeight: fontWeights.bold },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.base,
    fontSize: typography.fontSizeBase,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm },
});

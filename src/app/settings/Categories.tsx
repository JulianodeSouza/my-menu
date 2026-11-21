import * as icons from "lucide-react-native/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { ButtonPrimary } from "~/components/Buttons/ButtonPrimary";
import { ButtonText } from "~/components/Buttons/ButtonText";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useModalConfirmation } from "~/contexts/DialogContext";
import { useTheme } from "~/contexts/ThemeContext";
import { removeItemCache } from "~/services/cache";
import { setInfoToast } from "~/store/reducers/geral";
import { CategorieProps } from "~/types/categories";
import { loadCategories } from "~/utils/cacheFunctions";
import { borderRadius, fontWeights, spacing, typography } from "../../../theme";

const CATEGORY_ICONS: Array<keyof typeof icons> = [
  "Tag",
  "Apple",
  "Beef",
  "Utensils",
  "Coffee",
  "Milk",
  "Cookie",
  "Pizza",
  "Fish",
  "Carrot",
  "Sparkles",
  "Shirt",
  "Baby",
  "Heart",
  "ShoppingBag",
  "BottleWine",
];

const DEFAULT_ICON: keyof typeof icons = "Tag";

export default function Categories() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { postApi, putApi, deleteApi } = useApi();
  const confirmationModal = useModalConfirmation();
  const [categories, setCategories] = useState<CategorieProps[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategorieProps | null>(null);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof icons>(DEFAULT_ICON);
  const [modalVisible, setModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    setCategories(await loadCategories());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setSelectedIcon(DEFAULT_ICON);
    setModalVisible(true);
  };

  const openEdit = (category: CategorieProps) => {
    setEditingCategory(category);
    setName(category.name);
    setSelectedIcon(category.icon || DEFAULT_ICON);
    setModalVisible(true);
  };

  const saveCategory = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      const payload = { name: trimmedName, icon: selectedIcon };
      if (editingCategory) {
        await putApi(`categories/${editingCategory.id}`, payload);
      } else {
        await postApi("categories", payload);
      }

      await removeItemCache("categories");
      setModalVisible(false);
      await loadData();
      dispatch(
        setInfoToast({
          open: true,
          message: editingCategory ? "Categoria atualizada com sucesso" : "Categoria adicionada com sucesso",
          type: "success",
        })
      );
    } catch (error: any) {
      console.error("Erro ao salvar categoria:", error);
      dispatch(
        setInfoToast({
          open: true,
          message: error?.response?.data?.message || "Erro ao salvar categoria",
          type: "error",
        })
      );
    }
  };

  const removeCategory = (category: CategorieProps) => {
    confirmationModal.openModalConfirmation(
      `Deseja excluir a categoria "${category.name}"?`,
      async () => {
        await deleteApi(`categories/${category.id}`);
        await removeItemCache("categories");
        await loadData();
        dispatch(
          setInfoToast({
            open: true,
            message: "Categoria removida com sucesso",
            type: "success",
          })
        );
      }
    );
  };

  const headerIconStyle = useMemo(
    () => ({
      backgroundColor: theme.primaryOpacity10,
      padding: spacing.sm,
      borderRadius: borderRadius.xl,
    }),
    [theme.primaryOpacity10]
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={headerIconStyle}>
            <Icon name="Tag" color={theme.primary} />
          </View>
          <View style={styles.titleTexts}>
            <TextComponent style={styles.title}>Categorias</TextComponent>
            <TextComponent style={styles.subtitle}>Organize seus produtos</TextComponent>
          </View>
          <ButtonText testID="settings-category-btn-add" title="Adicionar" iconStart="Plus" onPress={openCreate} />
        </View>
        <View style={styles.listContainer}>
          <View style={{ flex: 1 }}>
            <TextComponent style={styles.title}>Categorias</TextComponent>
            <TextComponent style={styles.subtitle}>{categories.length} categorias</TextComponent>
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={openEdit}
                onDelete={removeCategory}
              />
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
              {editingCategory ? "Editar categoria" : "Adicionar categoria"}
            </TextComponent>
            <TextInput
              value={name}
              onChangeText={setName}
              testID="settings-category-input-name"
              placeholder="Nome da categoria"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              autoFocus
            />
            <View style={styles.iconSelectorSection}>
              <TextComponent style={styles.label}>Ícone</TextComponent>
              <View testID="settings-category-icon-selector" style={styles.iconSelector}>
                {CATEGORY_ICONS.map((iconName) => {
                  const isSelected = selectedIcon === iconName;
                  return (
                    <TouchableOpacity
                      key={iconName}
                      testID={`settings-category-icon-option-${iconName.toLowerCase()}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Ícone ${iconName}`}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => setSelectedIcon(iconName)}
                      style={[
                        styles.iconOption,
                        {
                          borderColor: isSelected ? theme.primary : theme.border,
                          backgroundColor: isSelected ? theme.primaryOpacity10 : "transparent",
                        },
                      ]}>
                      <Icon
                        name={iconName}
                        color={isSelected ? theme.primary : theme.textMuted}
                        size={20}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.modalActions}>
              <ButtonText testID="settings-category-btn-cancel" title="Cancelar" onPress={() => setModalVisible(false)} />
              <ButtonPrimary testID="settings-category-btn-save" title="Salvar" onPress={saveCategory} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function CategoryItem({
  category,
  onEdit,
  onDelete,
}: {
  category: CategorieProps;
  onEdit: (category: CategorieProps) => void;
  onDelete: (category: CategorieProps) => void;
}) {
  const { theme } = useTheme();

  return (
    <View testID="settings-category-item" style={[styles.item, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.itemInfo}>
        <Icon name={category.icon || "Tag"} color={theme.primary} />
        <TextComponent style={styles.itemName}>{category.name}</TextComponent>
      </View>
      <View style={styles.actions}>
        <ButtonText title="" iconStart="Pen" iconSize={18}
          testID="settings-category-btn-edit" onPress={() => onEdit(category)} />
        <ButtonText
          title=""
          iconStart="Trash2"
          iconSize={18}
          testID="settings-category-btn-delete"
          iconColor={theme.error}
          onPress={() => onDelete(category)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, marginVertical: spacing.lg },
  titleContainer: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
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
  iconSelectorSection: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.fontSizeSm,
    fontWeight: fontWeights.medium,
  },
  iconSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm },
});

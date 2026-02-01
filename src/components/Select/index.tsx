import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, spacing, typography } from "theme";
import { useTheme } from "~/contexts/ThemeContext";
import { SelectProps } from "~/types/select";
import LabelInput from "../LabelInput";

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  style,
  optionStyle,
  labelStyle,
  isRequired,
}) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);

  const ITEM_HEIGHT = 60;
  const MAX_VISIBLE_ITEMS = 10;
  const modalHeight = Math.min(options.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

  return (
    <View style={[styles.container, style]}>
      {label && <LabelInput text={label} style={labelStyle} isRequired={isRequired} />}
      <TouchableOpacity
        style={[styles.selectBox, style, { borderColor: theme.border }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}>
        <Text style={[styles.selectedText, { color: theme.text }]}>
          {selected ? selected.label : "Selecione..."}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}
          onPress={() => setVisible(false)}>
          <View style={[styles.modalContent, { height: modalHeight, backgroundColor: theme.card }]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => {
                const isLast = index === options.length - 1;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      optionStyle,
                      { borderBottomColor: theme.border },
                      isLast && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      onChange(item.value);
                      setVisible(false);
                    }}>
                    <Text style={[styles.optionText, { color: theme.text }]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  selectBox: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.base,
  },
  selectedText: {
    fontSize: typography.fontSizeBase,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: borderRadius.sm,
    minWidth: 300,
    paddingVertical: spacing.sm,
  },
  option: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: typography.fontSizeBase,
  },
});

export default Select;

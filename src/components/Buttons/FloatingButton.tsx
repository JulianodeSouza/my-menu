import { FAB } from "react-native-paper";
import { StyleSheet, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type FloatingButtonProps = {
  icon?: React.ReactNode;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function FloatingButton({ icon, color, onPress, style }: FloatingButtonProps) {
  return (
    <FAB
      icon={() => icon || <MaterialIcons name="add" size={24} color="white" />}
      onPress={onPress}
      style={[styles.fab, { backgroundColor: color || "green" }, style]}
      color="white"
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    borderRadius: 28,
  },
});

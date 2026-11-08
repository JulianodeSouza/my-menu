import { StyleSheet, View, ViewStyle } from "react-native";
import { FAB } from "react-native-paper";
import Icon from "../Icon";

type FloatingButtonProps = {
  icon?: React.ReactNode;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
};

export default function FloatingButton({ icon, color, onPress, style, testID }: FloatingButtonProps) {
  return (
    <View testID={testID} accessibilityLabel={testID} accessible={true}>
      <FAB
        testID={testID}
        accessibilityLabel={testID}
        icon={() => icon || <Icon name="Plus" size={24} color="white" />}
        onPress={onPress}
        style={[styles.fab, { backgroundColor: color || "green" }, style]}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    borderRadius: 28,
  },
});

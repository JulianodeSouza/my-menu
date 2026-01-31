import { StyleSheet, View } from "react-native";
import { fontWeights, spacing, typography } from "theme";
import { useTheme } from "~/contexts/ThemeContext";
import { TextComponent } from "../Text";

interface LabelInputProps {
  text: string;
  style?: object;
  isRequired?: boolean;
}

export default function LabelInput({ text, style, isRequired }: LabelInputProps) {
  const { theme } = useTheme();
  return (
    <>
      <View style={styles.labelContainer}>
        <TextComponent style={[styles.label, style]}>{text}</TextComponent>
        {isRequired && (
          <TextComponent style={[styles.asterisk, { color: theme.error }]}>*</TextComponent>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.fontSizeLg,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs,
  },
  asterisk: {
    fontWeight: fontWeights.bold,
    marginLeft: spacing.xs,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

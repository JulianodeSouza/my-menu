import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "~/contexts/ThemeContext";
import { spacing } from "../../theme";

export const Container = ({ children, testID, ...rest }: { children: ReactNode; testID?: string } & ViewProps) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      testID={testID}
      accessibilityLabel={testID}
      style={[styles.container, { backgroundColor: theme.background }]}
      {...rest}>
      <View testID={testID} accessibilityLabel={testID} style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  content: {
    flex: 1,
  },
});

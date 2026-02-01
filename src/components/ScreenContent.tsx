import { StyleSheet, View, ViewProps } from "react-native";

type ScreenContentProps = {
  children: React.ReactNode;
} & ViewProps;

export const ScreenContent = ({ children, ...ViewProps }: ScreenContentProps) => {
  return (
    <View style={[styles.container, ...(ViewProps.style ? [ViewProps.style] : [])]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});

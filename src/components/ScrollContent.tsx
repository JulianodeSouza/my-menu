import React from "react";
import { ScrollView } from "react-native";

export default function ScrollContent({
  children,
  refreshing,
  onRefresh,
}: {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <ScrollView style={{ flex: 1, height: "90%" }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

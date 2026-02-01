import { RefreshControl, ScrollView } from "react-native";
import { IScrollContent } from "~/types/scrollContent";

export default function ScrollContent({ children, onRefreshControl, refreshing }: IScrollContent) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshControl} />}>
      {children}
    </ScrollView>
  );
}

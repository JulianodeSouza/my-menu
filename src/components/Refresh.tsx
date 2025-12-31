import { RefreshControl } from "react-native";

export default function Refresh({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}

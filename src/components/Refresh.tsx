import { RefreshControl } from "react-native";

export default function Refresh({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean;
  onRefresh: () => void;
}) {
  console.log(refreshing);

  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}

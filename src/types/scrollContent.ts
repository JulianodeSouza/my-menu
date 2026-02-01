export type IScrollContent = {
  children: React.ReactNode;
  onRefreshControl?: () => void;
  refreshing?: boolean;
};

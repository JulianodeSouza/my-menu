import * as icons from "lucide-react-native/icons";
import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export type IListPurchase = {
  id?: number;
  name: string;
  quantity: number;
  category: number;
  categoryIcon?: string;
  measuredUnitName: string;
  measuredUnit: number;
  unitSymbol?: string;
  active?: boolean;
  totalCaught?: number;
  amount?: number;
  checked?: boolean;
};

export type IItemChecked = {
  itemChecked: boolean;
  totalCaught: number;
  amount: number;
};

export type IListPurchaseView = {
  category: string;
  items: IListPurchase[];
  categoryIcon: keyof typeof icons;
} & { index?: number };

export type ICardShop = {
  children: React.ReactNode;
  styles?: ViewStyle;
  isPressable?: boolean;
  onPress?: () => void;
};

export type ShoppingContextType = {
  shoppingList: IListPurchaseView[];
  setShoppingList: (items: IListPurchaseView[]) => void;
  loadItems: boolean;
  setLoadItems: (load: boolean) => void;
  totalPurchase: number;
  setTotalPurchase: (total: number) => void;
  progress: number;
  setProgress: (progress: number) => void;
  refreshItems: boolean;
  setRefreshItems: (refresh: boolean) => void;
  // Actions
  finishPurchase: () => Promise<void>;
};

export type ShoppingProviderProps = {
  children: ReactNode;
};

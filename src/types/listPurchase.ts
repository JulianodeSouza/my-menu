export type IListPurchase = {
  id: number;
  name: string;
  quantity: number;
  category: string;
  measuredUnit: string;
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
};

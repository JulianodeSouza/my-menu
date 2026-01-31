import { IListPurchaseView } from "./shopList";

export type IDialog = {
  open: boolean;
  item: IListPurchaseView | {};
};

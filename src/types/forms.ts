import { IListPurchase } from "./shopList";

export type PropsForm = {
  save: (values: any) => void;
  formMode: "edit" | "mark" | "register";
  isEdit?: boolean;
  item?: IListPurchase;
};

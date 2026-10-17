import { IListPurchase } from "./shopList";

export type PropsForm = {
  save: (values: any) => void | Promise<void>;
  formMode: "edit" | "register";
  isEdit?: boolean;
  item?: IListPurchase;
};

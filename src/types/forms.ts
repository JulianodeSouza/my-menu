import { IListPurchase } from "./shopList";

export type PropsForm = {
  save: (values: any) => boolean | void | Promise<boolean | void>;
  formMode: "edit" | "register";
  isEdit?: boolean;
  item?: IListPurchase;
};

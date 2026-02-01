import * as icons from "lucide-react-native/icons";

export type ICategories = {
  id_category: number;
  name: string;
};

export type CategorieProps = {
  id: number;
  name: string;
  icon: keyof typeof icons;
};

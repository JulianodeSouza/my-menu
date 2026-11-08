import { useEffect, useState } from "react";
import { loadCategories } from "~/utils/cacheFunctions";
import { CategorieProps } from "~/types/categories";
import { Select } from ".";

type SelectCategoriesProps = {
  value: string;
  handleChange: (value: number) => void;
  isRequired?: boolean;
  error?: boolean;
  textError?: string;
  testID?: string;
};

export default function SelectCategories({
  value,
  handleChange,
  isRequired,
  error,
  textError,
  testID,
}: SelectCategoriesProps) {
  const [categories, setCategories] = useState<CategorieProps[]>([]);

  useEffect(() => {
    loadCategories().then(setCategories);
  }, []);

  return (
    <Select
      testID={testID}
      label="Categoria"
      options={categories.map((category) => ({ label: category.name, value: String(category.id) }))}
      value={value}
      onChange={(selectedValue) => handleChange(Number(selectedValue))}
      isRequired={isRequired}
      error={error}
      textError={textError}
    />
  );
}

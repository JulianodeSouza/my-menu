import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useCategoryDatabase } from "~/db/categoryDatabase";

export default function SelectCategories({ value, handleChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryDatabase = useCategoryDatabase();

  useEffect(() => {
    const loadCategories = async () => {
      const result = await categoryDatabase.listAllCategories();
      setCategories(result);
    };

    if (loading) {
      setLoading(false);
      loadCategories();
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <Picker
      placeholder="Categoria"
      selectedValue={value || ""}
      onValueChange={(itemValue) => handleChange(itemValue)}>
      {categories.map((category) => (
        <Picker.Item key={category.idCategory} value={category.idCategory} label={category.name} />
      ))}
    </Picker>
  );
}

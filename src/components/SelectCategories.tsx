import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useApi } from "~/ApiContext";

export default function SelectCategories({ value, handleChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useApi();

  useEffect(() => {
    const loadCategories = async () => {
      const result = await apiContext.getApi("categories");
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
      style={{ backgroundColor: "#fff", borderWidth: 1, borderRadius: 10 }}
      placeholder="Categoria"
      selectedValue={value || ""}
      onValueChange={(itemValue) => {
        handleChange(itemValue);
      }}>
      {categories.map((category) => (
        <Picker.Item key={category.id} value={category.id} label={category.name} />
      ))}
    </Picker>
  );
}

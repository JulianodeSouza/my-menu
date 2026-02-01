import { useEffect, useState } from "react";
import { useApi } from "~/ApiContext";
import { Select } from ".";

export default function SelectCategories({ value, handleChange, isRequired }) {
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
    <Select
      label="Categoria"
      options={categories.map((category) => ({ label: category.name, value: category.id }))}
      value={value}
      onChange={handleChange}
      isRequired={isRequired}
    />
  );
}

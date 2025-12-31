import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useApi } from "~/ApiContext";

export default function SelectMeasuredUnits({ value, handleChange }) {
  const apiContext = useApi();
  const [measuredUnits, setMeasuredUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMeasuredUnits = async () => {
      const result = await apiContext.getApi("measuredUnits");
      setMeasuredUnits(result);
    };

    if (loading) {
      setLoading(false);
      loadMeasuredUnits();
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <Picker
      style={{ backgroundColor: "#fff", borderWidth: 1, marginTop: 10 }}
      placeholder="Categoria"
      selectedValue={value || ""}
      onValueChange={(itemValue) => handleChange(itemValue)}>
      {measuredUnits.map((measuredUnit) => (
        <Picker.Item key={measuredUnit.id} value={measuredUnit.id} label={measuredUnit.name} />
      ))}
    </Picker>
  );
}

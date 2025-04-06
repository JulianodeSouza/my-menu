import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useCategoryDatabase } from "~/db/categoryDatabase";
import { useMeasuredUnitDatabase } from "~/db/measuredUnit";

export default function SelectMeasuredUnits({ value, handleChange }) {
  const [measuredUnits, setMeasuredUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const measuredUnitDatabase = useMeasuredUnitDatabase();

  useEffect(() => {
    const loadMeasuredUnits = async () => {
      const result = await measuredUnitDatabase.listAllMeasuredUnits();
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

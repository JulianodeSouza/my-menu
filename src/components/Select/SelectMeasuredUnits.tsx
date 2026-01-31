import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useApi } from "~/ApiContext";
import Select from ".";

export default function SelectMeasuredUnits({ value, handleChange, isRequired }) {
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
    <Select
      style={styles.inputSelect}
      label="Unidade de medida"
      options={measuredUnits.map((unit) => ({ label: unit.name, value: unit.id }))}
      value={value}
      onChange={handleChange}
      isRequired={isRequired}
    />
  );
}

const styles = StyleSheet.create({
  inputSelect: {
    width: "100%",
  },
});

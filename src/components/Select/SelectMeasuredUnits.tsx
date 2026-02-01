import AsyncStorage from "@react-native-async-storage/async-storage";
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
      try {
        // Try to get from cache first
        const cachedUnits = await AsyncStorage.getItem("measuredUnits");
        if (cachedUnits) {
          setMeasuredUnits(JSON.parse(cachedUnits));
        } else {
          // If not in cache, fetch from API
          const result = await apiContext.getApi("measuredUnits");
          setMeasuredUnits(result);
          await AsyncStorage.setItem("measuredUnits", JSON.stringify(result));
        }
      } catch (error) {
        console.error("Erro ao carregar unidades de medida:", error);
      } finally {
        setLoading(false);
      }
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

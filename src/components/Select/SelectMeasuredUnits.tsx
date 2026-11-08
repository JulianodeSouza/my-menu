import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { loadMeasuredUnits } from "~/utils/cacheFunctions";
import { IMeasuredUnit } from "~/types/measuredUnit";
import Select from ".";

type SelectMeasuredUnitsProps = {
  value: string;
  handleChange: (value: number) => void;
  isRequired?: boolean;
  error?: boolean;
  textError?: string;
  testID?: string;
};

export default function SelectMeasuredUnits({
  value,
  handleChange,
  isRequired,
  error,
  textError,
  testID,
}: SelectMeasuredUnitsProps) {
  const [measuredUnits, setMeasuredUnits] = useState<IMeasuredUnit[]>([]);

  useEffect(() => {
    loadMeasuredUnits().then(setMeasuredUnits);
  }, []);

  return (
    <Select
      testID={testID}
      style={styles.inputSelect}
      label="Unidade de medida"
      options={measuredUnits.map((unit) => ({ label: unit.name, value: String(unit.id) }))}
      value={value}
      onChange={(selectedValue) => handleChange(Number(selectedValue))}
      isRequired={isRequired}
      error={error}
      textError={textError}
    />
  );
}

const styles = StyleSheet.create({
  inputSelect: {
    width: "100%",
  },
});

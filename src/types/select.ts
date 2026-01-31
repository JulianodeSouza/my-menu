import { TextStyle, ViewStyle } from "react-native";

export type Option = {
  label: string;
  value: string;
};

export type SelectProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  isRequired?: boolean;
};

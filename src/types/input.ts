import { TextInputProps, TextStyle, ViewStyle } from "react-native";

export type InputProps = {
  label: string;
  isRequired?: boolean;
  inputStyle?: ViewStyle;
  error?: boolean;
  textError?: string;
  labelStyle?: TextStyle;
  mask?: (value: string) => string;
  unmask?: (value: string) => string;
} & TextInputProps;

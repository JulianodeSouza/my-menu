import { TouchableOpacityProps } from "react-native";

export type ButtonProps = {
  title: string;
  icon?: React.ReactNode;
} & TouchableOpacityProps;

import { TouchableOpacityProps } from "react-native";

export type IButtonProps = {
  title: string;
  icon?: React.ReactNode;
} & TouchableOpacityProps;

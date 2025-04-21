import { LinkProps } from "expo-router";
import { TouchableOpacityProps } from "react-native";

export type IButtonProps = {
  title: string;
  icon?: React.ReactNode;
} & TouchableOpacityProps;

export type IButtonLinkProps = {
  title: string;
  href: string;
} & LinkProps;

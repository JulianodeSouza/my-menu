import { LinkProps } from "expo-router";
import * as icons from "lucide-react-native/icons";
import { TouchableOpacityProps } from "react-native";

export type IButtonProps = {
  title: string;
  icon?: React.ReactNode;
  iconStart?: keyof typeof icons;
  iconEnd?: keyof typeof icons;
  iconSize?: number;
  iconColor?: string;
} & TouchableOpacityProps;

export type IButtonLinkProps = {
  title: string;
  href: string;
} & LinkProps;

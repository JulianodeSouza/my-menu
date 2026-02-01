import * as icons from "lucide-react-native/icons";
import { IconProps } from "~/types/icons";

const Icon = ({ name, color, size }: IconProps) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} />;
};

export default Icon;

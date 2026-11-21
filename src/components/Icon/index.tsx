import * as icons from "lucide-react-native/icons";
import { IconProps } from "~/types/icons";

const Icon = ({ name, color, size }: IconProps) => {
  const LucideIcon = (icons[name] || icons.Tag) as (typeof icons)["Tag"] | undefined;

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} />;
};

export default Icon;

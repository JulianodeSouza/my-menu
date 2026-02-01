import { Link } from "expo-router";
import { Pressable, StatusBar } from "react-native";
import { Divider } from "react-native-paper";
import Icon from "~/components/Icon";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useTheme } from "~/contexts/ThemeContext";
import { ShoppingProvider } from "../contexts/ShoppingContext";
import ShopList from "./shopList";

export default function Home() {
  const { theme, isDark } = useTheme();
  return (
    <>
      <ShoppingProvider>
        <HeaderScreen
          title="Minha Lista"
          headerRight={() => (
            <Link href={{ pathname: "/settings" }} asChild>
              <Pressable>
                <Icon name="Settings" color={theme.text} />
              </Pressable>
            </Link>
          )}
        />
        <Divider />
        <StatusBar animated={true} barStyle={isDark ? "light-content" : "dark-content"} />
        <ShopList />
      </ShoppingProvider>
    </>
  );
}

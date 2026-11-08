import { useRouter } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import Icon from "~/components/Icon";
import { HeaderScreen } from "~/components/ScreenHeader";
import { useTheme } from "~/contexts/ThemeContext";
import { ShoppingProvider } from "../contexts/ShoppingContext";
import ShopList from "./shopList";

export default function Home() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  return (
    <>
      <ShoppingProvider>
        <HeaderScreen
          title="Minha Lista"
          headerRight={() => (
            <TouchableOpacity
              testID="header-btn-settings"
              accessibilityLabel="Configurações"
              accessible={true}
              onPress={() => router.push("/settings")}>
              <Icon name="Settings" color={theme.text} />
            </TouchableOpacity>
          )}
        />
        <Divider />
        <StatusBar animated={true} barStyle={isDark ? "light-content" : "dark-content"} />
        <ShopList />
      </ShoppingProvider>
    </>
  );
}

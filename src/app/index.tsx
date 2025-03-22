import Feather from "@expo/vector-icons/Feather";
import { FAB } from "@rneui/base";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "theme";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";

export default function Home() {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const [loadItems, setLoadItems] = useState(false);




useEffect(() => {

  const loadData = async () => {

  







  };



  if(loadItems) {
    setLoadItems(false);

  }





}, [])








  return (
    <>
      <HeaderScreen headerShown={false} />
      <Container>
        <StatusBar barStyle={theme === darkTheme ? "dark-content" : "light-content"} />

        <Link href={{ pathname: "/settings" }} asChild>
          <Feather name="settings" size={35} color={theme.text} style={styles.settingsButton} />
        </Link>

        <ScreenContent style={styles.containerHome}>
          <Link href={{ pathname: "/addItems" }} asChild>
            <FAB style={styles.addButton} icon={{ name: "add", color: "white" }} color="green" />
          </Link>
        </ScreenContent>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  containerHome: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  addButton: {
    marginBottom: 35,
    marginRight: 15,
  },
  settingsButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

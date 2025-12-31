import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, useColorScheme, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setInfoToast } from "~/store/reducers/geral";
import { TextComponent } from "./Text";
import { darkTheme, lightTheme } from "theme";

export const Toast = () => {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const geral = useSelector((state: any) => state.geral);
  const dispatch = useDispatch();
  const bottom = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleClose = () => {
    dispatch(setInfoToast({ open: false, message: "", type: "" }));
  };

  function showToast() {
    // Reseta os valores para o estado inicial
    bottom.setValue(-80);
    opacity.setValue(1);

    Animated.timing(bottom, {
      toValue: 20,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Aguarda 3 segundos antes de fechar
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          handleClose();
        });
      }, 3000);
    });
  }

  const getBackgroundColor = (type: string): string => {
    let backgroundColor = theme.success;

    switch (type) {
      case "error":
        backgroundColor = theme.error;
        break;
      case "warning":
        backgroundColor = theme.warning;
        break;
      default:
        backgroundColor;
        break;
    }

    return backgroundColor;
  };

  useEffect(() => {
    if (geral.infoToast.open) {
      showToast();
    }
  }, [geral.infoToast.open]);

  return (
    <>
      {!!geral.infoToast.open ? (
        <Animated.View
          style={[
            style.container,
            { bottom, opacity, backgroundColor: getBackgroundColor(geral.infoToast.type) },
          ]}>
          <View style={style.toastInfo}>
            <TextComponent style={{ color: theme.textError, fontWeight: "bold" }}>
              {geral.infoToast.message}
            </TextComponent>
            <MaterialIcons
              style={{ alignContent: "center", color: "white" }}
              name="close"
              size={24}
              color="white"
              onPress={() => {
                handleClose();
              }}
            />
          </View>
        </Animated.View>
      ) : null}
    </>
  );
};

const style = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  toastInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

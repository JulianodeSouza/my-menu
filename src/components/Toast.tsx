import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "~/contexts/ThemeContext";
import { setInfoToast, ToastPosition } from "~/store/reducers/geral";
import { borderRadius, fontWeights, spacing } from "../../theme";
import { TextComponent } from "./Text";

/**
 * Exibe mensagens temporárias na posição definida pelo estado global do Redux.
 */
export const Toast = () => {
  const { theme } = useTheme();
  const geral = useSelector((state: any) => state.geral);
  const dispatch = useDispatch();
  const offset = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => {
    dispatch(setInfoToast({ open: false, message: "", type: "" }));
  };

  function showToast() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    offset.stopAnimation();
    opacity.stopAnimation();

    // Reseta os valores para o estado inicial
    offset.setValue(-80);
    opacity.setValue(1);

    Animated.timing(offset, {
      toValue: 20,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Aguarda 3 segundos antes de fechar
      timeoutRef.current = setTimeout(() => {
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

  const position = (geral.infoToast.position ?? "bottom") as ToastPosition;
  const positionStyle =
    position === "top"
      ? { top: offset, marginTop: spacing.lg }
      : { bottom: offset, marginBottom: spacing.lg };

  const getBackgroundColor = (type: string): string => {
    let backgroundColor = theme.success;

    switch (type) {
      case "error":
        backgroundColor = theme.error;
        break;
      case "warning":
        backgroundColor = theme.warning;
        break;
      case "info":
        backgroundColor = theme.info;
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

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      offset.stopAnimation();
      opacity.stopAnimation();
    };
  }, [geral.infoToast.open, geral.infoToast.message, geral.infoToast.position]);

  return (
    <>
      {!!geral.infoToast.open ? (
        <Animated.View
          style={[
            style.container,
            positionStyle,
            { opacity, backgroundColor: getBackgroundColor(geral.infoToast.type) },
          ]}>
          <View style={style.toastInfo}>
            <TextComponent style={[style.textToast, { color: theme.text }]}>
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
    left: 0,
    right: 0,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
  },
  textToast: {
    fontWeight: fontWeights.bold,
  },
  toastInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

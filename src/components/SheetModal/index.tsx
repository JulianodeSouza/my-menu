import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useTheme } from "~/contexts/ThemeContext";
import { borderRadius, fontWeights, shadows, spacing, typography } from "../../../theme";

type SheetModalContextValue = {
  scrollToFocusedInput: () => void;
};

const SheetModalContext = createContext<SheetModalContextValue | null>(null);

export function useSheetModalScroll() {
  return useContext(SheetModalContext);
}

type Side = "top" | "right" | "bottom" | "left";

type SheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: Side;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
};

const ANIMATION_DURATION = 300;

export function SheetModal({
  visible,
  onClose,
  children,
  side = "bottom",
  title,
  description,
  showCloseButton = true,
}: SheetModalProps) {
  const { theme } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const translateValue = useRef(new Animated.Value(windowHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const scrollOffsetRef = useRef(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const isVertical = side === "top" || side === "bottom";
  const animatedValue = translateValue;

  const getInitialValue = useCallback(() => {
    switch (side) {
      case "bottom":
        return windowHeight;
      case "top":
        return -windowHeight;
      case "right":
        return windowWidth;
      case "left":
        return -windowWidth;
      default:
        return windowHeight;
    }
  }, [side, windowHeight, windowWidth]);

  const scrollToFocusedInput = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentlyFocusedInput = TextInput.State.currentlyFocusedInput?.() as
        | {
            measureInWindow?: (
              callback: (x: number, y: number, width: number, height: number) => void
            ) => void;
          }
        | null
        | undefined;

      if (!currentlyFocusedInput?.measureInWindow || !scrollViewRef.current) return;

      currentlyFocusedInput.measureInWindow((_x, inputY, _width, inputHeight) => {
        scrollViewRef.current?.measureInWindow((_sx, scrollY, _sw, scrollHeight) => {
          if (!scrollHeight) return;

          const visibleBottom = scrollY + scrollHeight;
          const inputBottom = inputY + inputHeight + spacing.lg;
          const visibleTop = scrollY + spacing.sm;

          if (inputBottom > visibleBottom) {
            const nextOffset = scrollOffsetRef.current + (inputBottom - visibleBottom);
            scrollViewRef.current?.scrollTo({ y: Math.max(0, nextOffset), animated: true });
          } else if (inputY < visibleTop) {
            const nextOffset = scrollOffsetRef.current - (visibleTop - inputY);
            scrollViewRef.current?.scrollTo({ y: Math.max(0, nextOffset), animated: true });
          }
        });
      });
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const didShowSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
      scrollToFocusedInput();
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      didShowSubscription.remove();
      hideSubscription.remove();
    };
  }, [scrollToFocusedInput]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: getInitialValue(),
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [animatedValue, overlayOpacity, getInitialValue, onClose]);

  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (side === "bottom") return gestureState.dy > 6;
        if (side === "top") return gestureState.dy < -6;
        return false;
      },
      onPanResponderMove: (_, gestureState) => {
        if (side === "bottom" && gestureState.dy > 0) {
          animatedValue.setValue(gestureState.dy);
        }
        if (side === "top" && gestureState.dy < 0) {
          animatedValue.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 100;
        const shouldClose =
          (side === "bottom" && gestureState.dy > threshold) ||
          (side === "top" && gestureState.dy < -threshold);

        if (shouldClose) {
          handleCloseRef.current();
        } else {
          Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  const handleOpen = useCallback(() => {
    animatedValue.setValue(getInitialValue());

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }),
    ]).start();
  }, [animatedValue, overlayOpacity, getInitialValue]);

  useEffect(() => {
    if (visible) {
      handleOpen();
    }
  }, [visible, handleOpen]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  const getContainerStyle = () => {
    switch (side) {
      case "top":
        return styles.containerTop;
      case "left":
        return styles.containerLeft;
      case "right":
        return styles.containerRight;
      case "bottom":
      default:
        return [styles.containerBottom, { paddingTop: insets.top }];
    }
  };

  const getContentStyle = () => {
    const baseStyle = [
      styles.content,
      {
        backgroundColor: theme.card,
        borderColor: theme.border,
      },
    ];

    const positionStyles = {
      bottom: [
        styles.contentBottom,
        {
          maxHeight: isKeyboardVisible ? "100%" : "90%",
          paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
          transform: [{ translateY: animatedValue }],
        },
      ],
      top: [
        styles.contentTop,
        {
          paddingTop: insets.top,
          transform: [{ translateY: animatedValue }],
        },
      ],
      left: [styles.contentLeft, { transform: [{ translateX: animatedValue }] }],
      right: [styles.contentRight, { transform: [{ translateX: animatedValue }] }],
    };

    return [...baseStyle, ...positionStyles[side]];
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={[styles.container, getContainerStyle()]}
        behavior="padding"
        enabled={isVertical}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={styles.overlayPressable} onPress={handleClose} />
        </Animated.View>

        <Animated.View style={getContentStyle()}>
          <View {...(isVertical ? panResponder.panHandlers : {})}>
            {side === "bottom" && (
              <View style={[styles.dragIndicator, { backgroundColor: theme.textMuted }]} />
            )}

            {(title || description || showCloseButton) && (
              <View
                style={[
                  styles.header,
                  { borderBottomColor: theme.textMuted, borderBottomWidth: 0.2 },
                ]}>
                <View style={styles.headerText}>
                  {title && (
                    <TextComponent style={[styles.title, { color: theme.foreground }]}>
                      {title}
                    </TextComponent>
                  )}
                  {description && (
                    <TextComponent style={[styles.description, { color: theme.mutedForeground }]}>
                      {description}
                    </TextComponent>
                  )}
                </View>
                {showCloseButton && (
                  <Pressable
                    style={[styles.closeButton]}
                    onPress={handleClose}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar">
                    <Icon name="X" color={theme.foreground} size={typography.fontSizeBase} />
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <SheetModalContext.Provider value={{ scrollToFocusedInput }}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              onScroll={handleScroll}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              keyboardDismissMode="on-drag">
              {children}
            </ScrollView>
          </SheetModalContext.Provider>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Componentes auxiliares para composição
type SheetSectionProps = {
  children: React.ReactNode;
  style?: object;
};

export function SheetHeader({ children, style }: SheetSectionProps) {
  return <View style={[styles.sectionHeader, style]}>{children}</View>;
}

export function SheetFooter({ children, style }: SheetSectionProps) {
  return <View style={[styles.sectionFooter, style]}>{children}</View>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <TextComponent style={[styles.title, { color: theme.foreground }]}>{children}</TextComponent>
  );
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <TextComponent style={[styles.description, { color: theme.mutedForeground }]}>
      {children}
    </TextComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBottom: {
    justifyContent: "flex-end",
  },
  containerTop: {
    justifyContent: "flex-start",
  },
  containerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  containerRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  overlayPressable: {
    flex: 1,
  },
  content: {
    ...shadows.lg,
    display: "flex",
    flexDirection: "column",
    flexShrink: 1,
  },
  contentBottom: {
    width: "100%",
    maxHeight: "90%",
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopWidth: 1,
  },
  contentTop: {
    width: "100%",
    maxHeight: "90%",
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    borderBottomWidth: 1,
  },
  contentLeft: {
    height: "100%",
    width: "75%",
    maxWidth: 320,
    borderRightWidth: 1,
    borderTopRightRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  contentRight: {
    height: "100%",
    width: "75%",
    maxWidth: 320,
    borderLeftWidth: 1,
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.base,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizeXl,
    fontWeight: fontWeights.semibold,
  },
  description: {
    fontSize: typography.fontSizeSm,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  body: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  bodyContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.base,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: "column",
    gap: spacing.xs,
    padding: spacing.base,
  },
  sectionFooter: {
    marginTop: "auto",
    flexDirection: "column",
    gap: spacing.sm,
    padding: spacing.base,
  },
});

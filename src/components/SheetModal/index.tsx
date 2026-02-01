import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { borderRadius, fontWeights, shadows, spacing, typography } from "theme";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useTheme } from "~/contexts/ThemeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const isVertical = side === "top" || side === "bottom";
  const animatedValue = translateY;

  const getInitialValue = useCallback(() => {
    switch (side) {
      case "bottom":
        return SCREEN_HEIGHT;
      case "top":
        return -SCREEN_HEIGHT;
      case "right":
        return SCREEN_HEIGHT;
      case "left":
        return -SCREEN_HEIGHT;
      default:
        return SCREEN_HEIGHT;
    }
  }, [side]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (side === "bottom") return gestureState.dy > 0;
        if (side === "top") return gestureState.dy < 0;
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
          handleClose();
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

  const handleClose = useCallback(() => {
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

  useEffect(() => {
    if (visible) {
      handleOpen();
    }
  }, [visible, handleOpen]);

  const getContentStyle = () => {
    const baseStyle = [
      styles.content,
      {
        backgroundColor: theme.card,
        borderColor: theme.border,
      },
    ];

    const positionStyles = {
      bottom: [styles.contentBottom, { transform: [{ translateY: animatedValue }] }],
      top: [styles.contentTop, { transform: [{ translateY: animatedValue }] }],
      left: [styles.contentLeft, { transform: [{ translateX: animatedValue }] }],
      right: [styles.contentRight, { transform: [{ translateX: animatedValue }] }],
    };

    return [...baseStyle, ...positionStyles[side]];
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay]}>
          <Pressable style={styles.overlayPressable} onPress={handleClose} />
        </Animated.View>

        <Animated.View style={getContentStyle()} {...(isVertical ? panResponder.panHandlers : {})}>
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

          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
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
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayPressable: {
    flex: 1,
  },
  content: {
    ...shadows.lg,
    maxHeight: "80%",
  },
  contentBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopWidth: 1,
  },
  contentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    borderBottomWidth: 1,
  },
  contentLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "75%",
    maxWidth: 320,
    borderRightWidth: 1,
    borderTopRightRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  contentRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
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
    marginBottom: spacing.xxl,
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
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
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

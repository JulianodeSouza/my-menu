import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "~/contexts/ThemeContext";
import { borderRadius, fontWeights, spacing, typography } from "../../theme";
import { TextComponent } from "./Text";

interface SplashScreenProps {
  isVisible: boolean;
  onFinish?: () => void;
}

export const SplashScreen = ({ isVisible, onFinish }: SplashScreenProps) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dot1Opacity = useRef(new Animated.Value(1)).current;
  const dot2Opacity = useRef(new Animated.Value(0.7)).current;
  const dot3Opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isVisible) return;

    // Animação dos dots em loop
    const animateDots = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.4,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        animateDots();
      });
    };

    // Animação de escala e fade no início
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Inicia animação dos dots
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Inicia animação dos dots
    animateDots();

    // Timer para fade out e callback
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
        // Reset para próximo uso
        fadeAnim.setValue(1);
        scaleAnim.setValue(1);
        dot1Opacity.setValue(1);
        dot2Opacity.setValue(0.7);
        dot3Opacity.setValue(0.4);
      });
    }, 3300); // 800ms (scale) + 1500ms (delay) + 1000ms (buffer)

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          opacity: fadeAnim,
        },
      ]}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.primary,
              },
            ]}>
            <MaterialIcons name="shopping-cart" size={56} color={theme.background} />
          </View>
        </Animated.View>

        {/* App Name */}
        <View style={styles.textContainer}>
          <TextComponent
            size="fontSizeHero"
            style={[
              styles.appName,
              {
                color: theme.text,
                fontWeight: fontWeights.bold,
              },
            ]}>
            My Menu
          </TextComponent>

          <TextComponent
            size="fontSizeSm"
            style={[
              styles.subtitle,
              {
                color: theme.textSecondary,
              },
            ]}>
            Controle suas compras
          </TextComponent>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: theme.primary,
                opacity: dot1Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: theme.primary,
                opacity: dot2Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: theme.primary,
                opacity: dot3Opacity,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  appName: {
    fontSize: typography.fontSizeHero,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontWeight: fontWeights.normal,
  },
  loadingContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
});

// ===========================================
// TIPOGRAFIA
// ===========================================
export const typography = {
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeBase: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontSizeTitle: 28,
  fontSizeDisplay: 30,
  fontSizeHero: 36,
};

// ===========================================
// PESOS DE FONTE
// ===========================================
export const fontWeights = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

// ===========================================
// ESPAÇAMENTOS
// ===========================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ===========================================
// BORDAS ARREDONDADAS
// ===========================================
export const borderRadius = {
  sm: 8,
  md: 10,
  base: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  full: 9999,
};

// ===========================================
// SOMBRAS
// ===========================================
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  primary: {
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
  },
};

// ===========================================
// TEMA CLARO
// ===========================================
export const lightTheme = {
  // Cores Base
  background: "#fafafa",
  foreground: "#1a1a1a",
  card: "#ffffff",
  cardForeground: "#1a1a1a",

  // Cores de Texto
  text: "#2C2C2C",
  textSecondary: "#71717a",
  textMuted: "#a1a1aa",

  // Cores Primárias
  primary: "#22c55e",
  primaryForeground: "#ffffff",
  primaryDark: "#16a34a",

  // Cores Secundárias
  secondary: "#f4f4f5",
  secondaryForeground: "#1a1a1a",

  // Cores de Estado
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
  error: "#ef4444",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",

  // Cores de UI
  muted: "#f4f4f5",
  mutedForeground: "#71717a",
  border: "#e4e4e7",
  input: "#e4e4e7",
  inputBackground: "#ffffff",

  // Opacidades
  overlay: "rgba(0, 0, 0, 0.5)",
  primaryOpacity5: "rgba(34, 197, 94, 0.05)",
  primaryOpacity10: "rgba(34, 197, 94, 0.1)",
  secondaryOpacity50: "rgba(244, 244, 245, 0.5)",
};

// ===========================================
// TEMA ESCURO
// ===========================================
export const darkTheme = {
  // Cores Base
  background: "#0a0a0a",
  foreground: "#fafafa",
  card: "#1a1a1a",
  cardForeground: "#fafafa",

  // Cores de Texto
  text: "#EDEDED",
  textSecondary: "#F4C842",
  textMuted: "#a1a1aa",

  // Cores Primárias
  primary: "#22c55e",
  primaryForeground: "#ffffff",
  primaryDark: "#16a34a",

  // Cores Secundárias
  secondary: "#27272a",
  secondaryForeground: "#fafafa",

  // Cores de Estado
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
  error: "#ef4444",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",

  // Cores de UI
  muted: "#27272a",
  mutedForeground: "#a1a1aa",
  border: "#27272a",
  input: "#27272a",
  inputBackground: "#1a1a1a",

  // Opacidades
  overlay: "rgba(0, 0, 0, 0.5)",
  primaryOpacity5: "rgba(34, 197, 94, 0.05)",
  primaryOpacity10: "rgba(34, 197, 94, 0.1)",
  secondaryOpacity50: "rgba(39, 39, 42, 0.5)",
};

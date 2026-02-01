import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "theme";

/**
 * Estilos globais utilitários para uso em toda a aplicação.
 * Baseado no guia de estilos do projeto.
 */
export const globalStyles = StyleSheet.create({
  // ===========================================
  // FLEXBOX
  // ===========================================
  flex1: { flex: 1 },
  flexRow: { flexDirection: "row" },
  flexCol: { flexDirection: "column" },
  flexWrap: { flexWrap: "wrap" },

  // Align Items
  itemsCenter: { alignItems: "center" },
  itemsStart: { alignItems: "flex-start" },
  itemsEnd: { alignItems: "flex-end" },
  itemsStretch: { alignItems: "stretch" },

  // Justify Content
  justifyCenter: { justifyContent: "center" },
  justifyBetween: { justifyContent: "space-between" },
  justifyAround: { justifyContent: "space-around" },
  justifyEvenly: { justifyContent: "space-evenly" },
  justifyStart: { justifyContent: "flex-start" },
  justifyEnd: { justifyContent: "flex-end" },

  // Combinações comuns
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ===========================================
  // CONTAINER
  // ===========================================
  container: {
    width: "100%",
    maxWidth: 672,
    alignSelf: "center",
    paddingHorizontal: spacing.base,
  },

  // ===========================================
  // GAPS
  // ===========================================
  gapXs: { gap: spacing.xs },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapBase: { gap: spacing.base },
  gapLg: { gap: spacing.lg },
  gapXl: { gap: spacing.xl },
  gapXxl: { gap: spacing.xxl },

  // ===========================================
  // PADDING
  // ===========================================
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMd: { padding: spacing.md },
  pBase: { padding: spacing.base },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },
  pXxl: { padding: spacing.xxl },

  // Padding Horizontal
  pxXs: { paddingHorizontal: spacing.xs },
  pxSm: { paddingHorizontal: spacing.sm },
  pxMd: { paddingHorizontal: spacing.md },
  pxBase: { paddingHorizontal: spacing.base },
  pxLg: { paddingHorizontal: spacing.lg },
  pxXl: { paddingHorizontal: spacing.xl },

  // Padding Vertical
  pyXs: { paddingVertical: spacing.xs },
  pySm: { paddingVertical: spacing.sm },
  pyMd: { paddingVertical: spacing.md },
  pyBase: { paddingVertical: spacing.base },
  pyLg: { paddingVertical: spacing.lg },
  pyXl: { paddingVertical: spacing.xl },

  // ===========================================
  // MARGIN
  // ===========================================
  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMd: { margin: spacing.md },
  mBase: { margin: spacing.base },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },

  // Margin Bottom
  mbXs: { marginBottom: spacing.xs },
  mbSm: { marginBottom: spacing.sm },
  mbMd: { marginBottom: spacing.md },
  mbBase: { marginBottom: spacing.base },
  mbLg: { marginBottom: spacing.lg },
  mbXl: { marginBottom: spacing.xl },

  // Margin Top
  mtXs: { marginTop: spacing.xs },
  mtSm: { marginTop: spacing.sm },
  mtMd: { marginTop: spacing.md },
  mtBase: { marginTop: spacing.base },
  mtLg: { marginTop: spacing.lg },
  mtXl: { marginTop: spacing.xl },

  // ===========================================
  // TEXT ALIGN
  // ===========================================
  textCenter: { textAlign: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },

  // ===========================================
  // WIDTH / HEIGHT
  // ===========================================
  wFull: { width: "100%" },
  hFull: { height: "100%" },
  wAuto: { width: "auto" },
  hAuto: { height: "auto" },

  // ===========================================
  // BORDER RADIUS
  // ===========================================
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedBase: { borderRadius: borderRadius.base },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  roundedXxl: { borderRadius: borderRadius.xxl },
  roundedFull: { borderRadius: borderRadius.full },

  // ===========================================
  // POSITION
  // ===========================================
  relative: { position: "relative" },
  absolute: { position: "absolute" },

  // Absolute Fill
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ===========================================
  // OVERFLOW
  // ===========================================
  overflowHidden: { overflow: "hidden" },
  overflowVisible: { overflow: "visible" },

  // ===========================================
  // Z-INDEX
  // ===========================================
  z10: { zIndex: 10 },
  z20: { zIndex: 20 },
  z30: { zIndex: 30 },
  z40: { zIndex: 40 },
  z50: { zIndex: 50 },

  // ===========================================
  // OPACITY
  // ===========================================
  opacity0: { opacity: 0 },
  opacity25: { opacity: 0.25 },
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity100: { opacity: 1 },
});

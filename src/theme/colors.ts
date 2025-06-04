export const COLORS = {
  // --- Core Palette ---
  background: "#F9F6F2", // A very light, warm, and sophisticated off-white/cream.
  surface: "#FFFFFF", // Pure white for cards, modals, and key UI elements for contrast.
  primary: "#795548", // A deep, warm, earthy brown for primary actions or accents.
  secondary: "#A1887F", // A softer, muted brown, complementary to primary.

  // --- Text ---
  textPrimary: "#3E2723", // Dark, rich coffee brown for high emphasis text.
  textSecondary: "#5D4037", // Slightly lighter brown for secondary text.
  textMuted: "#8D6E63", // Muted brown for less important text or placeholders.
  textOnPrimary: "#FFFFFF", // White text on primary color buttons/surfaces.
  textOnSurface: "#3E2723", // Primary text color for use on white surfaces.

  // --- Semantic & Utility ---
  border: "#E0D8D0", // A subtle, warm border color.
  divider: "#F1EAE4", // Very light divider line.
  disabled: "#D7CCC8", // For disabled elements, a muted warm gray.
  placeholder: "#A1887F", // Muted brown for placeholder text in inputs (matches secondary).

  success: "#66BB6A", // A clear, friendly green.
  error: "#EF5350", // A clear, noticeable red.
  warning: "#FFA726", // A warm orange.

  // --- Neutrals ---
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // --- Specific UI Elements (can be aliases or specific shades) ---
  inputBackground: "#FFFFFF", // Inputs will be on white surface.
  shadow: "rgba(0, 0, 0, 0.08)", // Soft, neutral shadow color.

  // --- Score Colors ---
  scoreHigh: "#4CAF50",
  scoreMediumHigh: "#FFC107",
  scoreMediumLow: "#FF9800",
  scoreLow: "#F44336",

  // --- Just Colors ---
  whiteTransparent20: "rgba(255, 255, 255, 0.2)",
};

export type ColorTheme = typeof COLORS;

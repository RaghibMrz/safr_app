import { Platform } from "react-native";

// Define base font families.
// Using system fonts for now. You can replace these with your custom font names later.
const FONT_FAMILY_REGULAR = Platform.select({
  ios: "HelveticaNeue",
  android: "Roboto",
  default: "sans-serif",
});

const FONT_FAMILY_BOLD = Platform.select({
  ios: "HelveticaNeue-Bold",
  android: "Roboto-Bold", // Or 'sans-serif-bold'
  default: "sans-serif-bold",
});

const FONT_FAMILY_MEDIUM = Platform.select({
  // Often a good weight for subheadings or emphasis
  ios: "HelveticaNeue-Medium",
  android: "Roboto-Medium", // Or 'sans-serif-medium'
  default: "sans-serif-medium",
});

// Define font weights.
// These are standard numeric values. Not all fonts support all weights.
// Match these to the actual weights available in your chosen fonts.
export const FONT_WEIGHTS = {
  thin: "100" as "100", // For very light text, if font supports
  extraLight: "200" as "200",
  light: "300" as "300",
  regular: "400" as "400",
  medium: "500" as "500",
  semiBold: "600" as "600",
  bold: "700" as "700",
  extraBold: "800" as "800",
  black: "900" as "900", // For very heavy text, if font supports
};

// Define a typographic scale for font sizes.
// Using a consistent scale helps maintain visual harmony.
export const FONT_SIZES = {
  xxs: 10, // Extra extra small
  xs: 12, // Extra small
  sm: 14, // Small
  md: 16, // Medium (base size for body text)
  lg: 18, // Large
  xl: 20, // Extra large
  xxl: 24, // Double extra large (for subheadings)
  h3: 28, // Heading 3
  h2: 34, // Heading 2
  h1: 40, // Heading 1 (large titles)
  logo: 48, // For the main app logo text
};

// Define line heights for readability.
// Often expressed as a multiplier of the font size, or absolute values.
export const LINE_HEIGHTS = {
  tight: 1.2, // For headings or short text
  normal: 1.5, // For body text
  relaxed: 1.8, // For longer passages if needed
  xs: FONT_SIZES.xs * 1.4,
  sm: FONT_SIZES.sm * 1.5,
  md: FONT_SIZES.md * 1.5,
  lg: FONT_SIZES.lg * 1.5,
  xl: FONT_SIZES.xl * 1.4,
  xxl: FONT_SIZES.xxl * 1.4,
  h3: FONT_SIZES.h3 * 1.3,
  h2: FONT_SIZES.h2 * 1.3,
  h1: FONT_SIZES.h1 * 1.2,
  logo: FONT_SIZES.logo * 1.1,
};

// Combine into a typography object that can be easily imported and used.
export const TYPOGRAPHY = {
  fontFamilyRegular: FONT_FAMILY_REGULAR,
  fontFamilyBold: FONT_FAMILY_BOLD,
  fontFamilyMedium: FONT_FAMILY_MEDIUM,
  weights: FONT_WEIGHTS,
  sizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,

  h1: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZES.h1,
    lineHeight: LINE_HEIGHTS.h1,
    fontWeight: FONT_WEIGHTS.bold,
  },
  h2: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZES.h2,
    lineHeight: LINE_HEIGHTS.h2,
    fontWeight: FONT_WEIGHTS.bold,
  },
  h3: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZES.h3,
    lineHeight: LINE_HEIGHTS.h3,
    fontWeight: FONT_WEIGHTS.bold,
  },
  bodyRegular: {
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
    fontWeight: FONT_WEIGHTS.regular,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILY_MEDIUM,
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.sm,
    fontWeight: FONT_WEIGHTS.regular,
  },
  caption: {
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS.xs,
    fontWeight: FONT_WEIGHTS.regular,
  },
  button: {
    fontFamily: FONT_FAMILY_MEDIUM,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  link: {
    fontFamily: FONT_FAMILY_MEDIUM,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  logo: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZES.logo,
    lineHeight: LINE_HEIGHTS.logo,
    fontWeight: FONT_WEIGHTS.bold,
  },
};

export type FontSizeType = keyof typeof FONT_SIZES;
export type FontWeightType = keyof typeof FONT_WEIGHTS;

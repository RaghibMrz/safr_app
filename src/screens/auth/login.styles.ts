import { Platform, StyleSheet } from "react-native";
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING["3xl"],
    paddingBottom: SPACING.lg,
  },
  logoText: {
    ...TYPOGRAPHY.logo,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
    textAlign: "center",
    fontFamily:
      Platform.OS === "ios"
        ? "HelveticaNeue-CondensedBold"
        : "sans-serif-condensed",
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING["3xl"],
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8, // Increased opacity for a more visible shadow
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  buttonPrimary: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.xl, // 20px margin below button
    // Shadow for primary button
    shadowColor: COLORS.primary, // Shadow with primary color for a slight glow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  buttonTextPrimary: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: "center",
    minHeight: TYPOGRAPHY.lineHeights.sm,
  },
  switchAuthLinkContainer: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  linkText: {
    ...TYPOGRAPHY.link,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  linkTextBold: {
    ...TYPOGRAPHY.link,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  // Fallback style for context error (should ideally not be seen)
  screenContainerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
});

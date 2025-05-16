// src/screens/tabs/home.styles.ts
import { Platform, StyleSheet } from "react-native";
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../../src/theme"; // Adjusted path

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  buttonOutline: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginLeft: SPACING.md,
  },
  buttonTextOutline: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonTextPrimary: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  list: {
    flex: 1,
  },
  listHeader: {
    ...TYPOGRAPHY.h3,
    fontSize: TYPOGRAPHY.sizes.xxl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  rankingItemCard: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg, // Consistent padding
    borderRadius: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between", // This pushes content and button apart
    alignItems: "center", // Vertically aligns items in the card
  },
  rankingItemContent: {
    flex: 1, // Allows text content to take up available space
    marginRight: SPACING.sm, // Add a small margin so text doesn't touch the button
  },
  rankingCity: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.xs,
  },
  rankingScore: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: SPACING.sm, // Hit area for the icon
    // No background color for a more subtle icon-only button
    // borderRadius: SPACING.pill, // If you wanted a circular background
    marginLeft: SPACING.xs, // Keep some space from the content
    justifyContent: "center",
    alignItems: "center",
  },
  // deleteButtonText is not used if we only have an icon, but kept for consistency
  // deleteButtonText: {
  //   color: COLORS.error,
  //   fontSize: TYPOGRAPHY.sizes.sm,
  //   fontWeight: FONT_WEIGHTS.bold,
  // },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    marginTop: SPACING["3xl"],
  },
  emptyText: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    textAlign: "center",
    opacity: 0.8,
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    textAlign: "center",
    padding: SPACING.md,
  },
});

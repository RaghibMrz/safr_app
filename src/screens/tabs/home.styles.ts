import { Platform, StyleSheet } from "react-native";
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg, // 16px
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.xl, // 8px iOS, 20px Android
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.lg, // 16px
    marginBottom: SPACING.md, // 12px
  },
  headerTitle: {
    ...TYPOGRAPHY.h2, // Use h2 style for a prominent title
    color: COLORS.textPrimary,
    flexShrink: 1, // Allow text to shrink if button is wide
  },
  buttonOutline: {
    paddingHorizontal: SPACING.md, // 12px
    paddingVertical: SPACING.sm, // 8px
    borderRadius: SPACING.sm, // 8px
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginLeft: SPACING.md, // Space between title and button
  },
  buttonTextOutline: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: TYPOGRAPHY.sizes.sm, // Slightly smaller for secondary action
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md, // 12px
    borderRadius: SPACING.sm, // 8px
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.lg, // 16px
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
    flex: 1, // Ensure list takes available space
  },
  listHeader: {
    ...TYPOGRAPHY.h3, // Use h3 style
    fontSize: TYPOGRAPHY.sizes.xxl, // Adjust if h3 is too big
    color: COLORS.textPrimary,
    marginBottom: SPACING.md, // 12px
    marginTop: SPACING.sm, // 8px
  },
  rankingItemCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg, // 16px
    borderRadius: SPACING.md, // 12px
    marginBottom: SPACING.md, // 12px
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8, // More visible shadow
    shadowRadius: 3,
    elevation: 3,
  },
  rankingCity: {
    ...TYPOGRAPHY.bodyMedium, // Use medium body text
    fontSize: TYPOGRAPHY.sizes.lg, // 18px
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.xs, // 4px
  },
  rankingScore: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.md, // 16px
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1, // Allow it to take up space in FlatList's ListEmptyComponent
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl, // 20px
    marginTop: SPACING["3xl"], // Push it down a bit
  },
  emptyText: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.lg, // 18px
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.sm, // 8px
  },
  emptySubText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    textAlign: "center",
    opacity: 0.8,
  },
  loader: {
    marginVertical: SPACING.xl, // 20px
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    textAlign: "center",
    padding: SPACING.md, // 12px
  },
});

// src/screens/tabs/home.styles.ts
import { Platform, StyleSheet } from "react-native";
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../theme";
import { DELETE_BUTTON_WIDTH } from "./home.constants";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header Styles
  headerContainer: {
    marginBottom: SPACING.md,
  },
  gradientHeader: {
    paddingTop: Platform.OS === "ios" ? SPACING.md : SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: SPACING.xl,
    borderBottomRightRadius: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    marginTop: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  greetingText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.md,
  },
  usernameText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.whiteTransparent20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.md,
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    alignItems: "center",
    flex: 1,
    marginHorizontal: SPACING.xs,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.bold,
    marginVertical: SPACING.xs,
  },
  statText: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.bold,
    marginVertical: SPACING.xs,
    paddingBottom: SPACING.xxs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  // Add Button
  addButtonContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  addRankingButton: {
    borderRadius: SPACING.md,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  addButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.lg,
  },

  // Section Title
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },

  // List Styles
  listContent: {
    paddingBottom: SPACING.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },

  // Empty States
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING["3xl"],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    paddingTop: SPACING["3xl"],
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  emptyActionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyActionText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },

  // Error State
  errorText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.error,
    textAlign: "center",
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  retryButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  retryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },

  // Legacy styles (kept for compatibility)
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.xxl,
  },

  // for SwipeableRankingItem
  container: {
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    backgroundColor: COLORS.error,
    borderRadius: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  deleteText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    fontWeight: FONT_WEIGHTS.medium,
  },
  contentContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rankingContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  leftSection: {
    marginRight: SPACING.lg,
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  middleSection: {
    flex: 1,
  },
  cityName: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.xs,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryText: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  rightSection: {
    marginLeft: SPACING.md,
  },
});

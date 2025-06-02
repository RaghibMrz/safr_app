// src/screens/tabs/addRanking.styles.ts
import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CITY_ICON_SIZE = 60;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },

  // Header
  header: {
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.textSecondary,
  },

  // Search Button
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchButtonText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.placeholder,
    marginLeft: SPACING.sm,
  },

  // Selected Cities Container
  selectedCitiesContainer: {
    minHeight: 100,
    marginBottom: SPACING.xl,
  },
  cityIconsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  cityIcon: {
    width: CITY_ICON_SIZE,
    height: CITY_ICON_SIZE,
    borderRadius: CITY_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    left: 0,
    top: 0,
  },
  cityIconText: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  cityScoreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    position: "absolute",
    bottom: 5,
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
  },
  removeCityButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
  },

  // Ranking Container - Horizontal Line
  rankingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING["3xl"],
    marginTop: SPACING.xl,
  },
  rankingLineWrapper: {
    flex: 1,
    height: 80,
    marginHorizontal: SPACING.sm,
    position: "relative",
    justifyContent: "center",
  },
  rankingLine: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreMarker: {
    position: "absolute",
    alignItems: "center",
    top: 0,
    bottom: 0,
    width: 1,
  },
  markerLine: {
    width: 1,
    flex: 1,
    backgroundColor: COLORS.divider,
  },
  markerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  rankingLabelLeft: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.semiBold,
    width: 25,
    textAlign: "center",
  },
  rankingLabelRight: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.semiBold,
    width: 30,
    textAlign: "center",
  },

  // Submit Button
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: TYPOGRAPHY.sizes.lg,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SPACING.xl,
    borderTopRightRadius: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: Platform.OS === "ios" ? 34 : SPACING.lg,
    height: screenHeight * 0.4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  modalSearchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  searchResultText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.textPrimary,
    flex: 1,
  },
  noResultsText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
    marginVertical: SPACING.xl,
  },

  // Utility Styles
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyRegular,
    textAlign: "center",
    color: COLORS.textMuted,
    padding: SPACING.lg,
  },
  centeredLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    textAlign: "center",
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },

  // Old styles kept for reference
  listHeaderContainer: {
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.lg,
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  searchInput: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export const CITY_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
  "#54A0FF",
  "#48DBFB",
  "#1DD1A1",
  "#FFA502",
];

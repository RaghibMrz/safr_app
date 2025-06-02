// src/screens/tabs/addRanking.styles.ts
import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const RANKING_LINE_HEIGHT = 300;
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
    position: "relative",
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

  // Ranking Container
  rankingContainer: {
    flex: 1,
    marginBottom: SPACING.xl,
  },
  rankingLine: {
    height: RANKING_LINE_HEIGHT,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankingLineGraphic: {
    flex: 1,
    height: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginHorizontal: SPACING.sm,
    position: "relative",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  rankingLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.semiBold,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SPACING.xl,
    borderTopRightRadius: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    maxHeight: screenHeight * 0.75,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
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
    maxHeight: screenHeight * 0.5,
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

  // Unused styles from previous version (kept for reference)
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
  cityList: {},
  cityPickerItem: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  cityPickerItemText: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
  },
  cityPickerItemSelected: {
    backgroundColor: COLORS.secondary,
  },
  listFooterContainer: {
    paddingTop: SPACING.md,
  },
  selectedCityText: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: "center",
    marginVertical: SPACING.lg,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPrimary: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
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
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  loader: {
    marginVertical: SPACING.xl,
  },
});

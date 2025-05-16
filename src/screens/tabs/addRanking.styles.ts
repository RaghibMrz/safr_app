// app/(tabs)/addRanking.styles.ts
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
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg, // 16px
  },
  // Styles for ListHeaderComponent content
  listHeaderContainer: {
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.lg,
    marginBottom: SPACING.sm, // Reduced margin as search input will have its own
  },
  // Screen title is handled by navigator options, so not styled here unless needed for a subtitle
  label: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.lg, // 18px
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.md, // 12px
    marginTop: SPACING.lg, // 16px
  },
  searchInput: {
    // New style for the search input
    width: "100%",
    height: 50, // Slightly shorter than main inputs for distinction
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SPACING.sm, // 8px
    paddingHorizontal: SPACING.md, // 12px
    fontSize: TYPOGRAPHY.sizes.md, // 16px
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg, // 16px margin below search input
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // Styles for the FlatList of cities
  cityList: {
    // The FlatList itself. If it's the main scroller, it might not need much direct styling.
    // Consider max height if it's not meant to take the whole screen before score input.
    // For now, assuming it's the primary scroller within its designated area.
  },
  cityPickerItem: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth, // Thinner separator
    borderBottomColor: COLORS.divider,
    // Removed individual item border/marginBottom for a more continuous list feel
  },
  cityPickerItemText: {
    ...TYPOGRAPHY.bodyRegular,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
  },
  cityPickerItemSelected: {
    backgroundColor: COLORS.secondary,
    // Optionally, add a visual cue like a border or icon for selection
    // borderLeftWidth: 3,
    // borderLeftColor: COLORS.primary,
  },
  // Styles for ListFooterComponent content
  listFooterContainer: {
    paddingTop: SPACING.md, // Reduced top padding if search results are above
    // paddingHorizontal: SPACING.lg, // screenContainer handles this
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
    // For the score input
    width: "100%",
    height: 55,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.5, // Consistent with auth inputs
    borderRadius: SPACING.md, // 12px, more modern
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, // Softer shadow
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPrimary: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md, // Consistent 12px radius
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm, // Reduced top margin
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
    fontSize: TYPOGRAPHY.sizes.lg, // Slightly larger button text
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  centeredLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.background, // Ensure consistent background
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    textAlign: "center",
    paddingVertical: SPACING.sm, // Reduced padding
    marginBottom: SPACING.md,
    minHeight: TYPOGRAPHY.lineHeights.sm, // Ensure space even if one line
  },
  emptyText: {
    ...TYPOGRAPHY.bodyRegular,
    textAlign: "center",
    color: COLORS.textMuted,
    padding: SPACING.lg, // Consistent padding
  },
});

// src/screens/tabs/addRanking.styles.ts
import { StyleSheet, Platform, Dimensions } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../theme";

const screenHeight = Dimensions.get("window").height;

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
  // --- Search Input Area ---
  searchContainer: {
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.lg,
    marginBottom: SPACING.sm,
    zIndex: 10, // Ensure search input is above other content if results overlay
  },
  searchInput: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SPACING.md, // More rounded
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  // --- Search Results List ---
  searchResultsContainer: {
    // This container will hold the FlatList for search results.
    // It could be absolutely positioned to overlay content, or conditionally rendered.
    // For now, let's style it for conditional rendering in the flow.
    maxHeight: screenHeight * 0.4, // Limit height to 40% of screen
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.sm,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginTop: -SPACING.xs, // Slightly overlap with search input bottom for connected feel
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 5, // Above other elements but below search input if it has higher zIndex
  },
  cityList: {
    // Style for the FlatList itself inside searchResultsContainer
    // No specific background or border needed here if container has it
  },
  cityPickerItem: {
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
    // This style might not be used if selection hides the list
    backgroundColor: COLORS.secondary,
  },
  // --- Selected City Display & Ranking Area ---
  rankingSection: {
    flex: 1, // Allow this section to take remaining space
    paddingTop: SPACING.md,
  },
  selectedCityDisplayContainer: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
    // backgroundColor: COLORS.surface, // Optional background
    // borderRadius: SPACING.sm,
  },
  selectedCityName: {
    ...TYPOGRAPHY.h3,
    fontSize: TYPOGRAPHY.sizes.xxl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  selectedCityPrompt: {
    // "Drag this onto the line below"
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  // RankingSlider will have its own styles from its component file
  // --- Score Input (Fallback or if RankingSlider is separate) & Submit Button ---
  scoreAndSubmitContainer: {
    // Wraps slider and submit button
    marginTop: SPACING.sm, // Space above the slider if it's not directly in rankingSection
  },
  label: {
    // Re-defined label for score input area
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
    textAlign: "center", // Center the "Set Your Personal Score" label
  },
  // Input style for score (if we were using TextInput, RankingSlider handles its own)
  // input: { ... } // Re-use existing input style if needed elsewhere
  buttonPrimary: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg, // More space above button
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
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  // --- Utility & Feedback Styles ---
  loader: {
    marginVertical: SPACING.xl,
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
  emptyListText: {
    // For FlatList's ListEmptyComponent
    ...TYPOGRAPHY.bodyRegular,
    textAlign: "center",
    color: COLORS.textMuted,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
});

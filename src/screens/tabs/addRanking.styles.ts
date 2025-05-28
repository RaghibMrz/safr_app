// src/screens/tabs/addRanking.styles.ts
import { StyleSheet, Platform, Dimensions } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../theme"; // Path to your theme

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width; // Get screen width for centering

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
  searchContainerFromStyles: {
    paddingTop: Platform.OS === "ios" ? SPACING.sm : SPACING.lg,
    marginBottom: SPACING.sm,
    zIndex: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SPACING.md,
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
    maxHeight: screenHeight * 0.35,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.sm,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 5,
  },
  cityList: {},
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
    backgroundColor: COLORS.secondary,
  },
  // --- Draggable Symbol Holding Area ---
  draggableSymbolHoldingArea: {
    height: 120,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SPACING.md,
    // backgroundColor: '#f0f0f0', // For debugging layout
  },
  // --- Selected City Display (when symbol is active or for prompt) ---
  selectedCityInfoContainer: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  selectedCityName: {
    ...TYPOGRAPHY.h3,
    fontSize: TYPOGRAPHY.sizes.xl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: "center",
  },
  selectedCityPrompt: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  // --- Ranking Section (contains RankingSlider and Submit) ---
  rankingSection: {
    paddingTop: SPACING.none,
    alignItems: "center",
    width: "100%",
    marginTop: SPACING.sm,
  },
  scoreAndSubmitContainer: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    // This is the label style definition
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  currentScoreDisplay: {
    ...TYPOGRAPHY.h2,
    fontSize: TYPOGRAPHY.sizes.h3,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    marginVertical: SPACING.sm,
    textAlign: "center",
  },
  buttonPrimary: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg,
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
  loader: { marginVertical: SPACING.xl },
  centeredLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    textAlign: "center",
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emptyListText: {
    ...TYPOGRAPHY.bodyRegular,
    textAlign: "center",
    color: COLORS.textMuted,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  symbol: {
    // For size reference in AddRankingScreen.tsx
    width: SPACING["5xl"] + SPACING.sm,
    height: SPACING["5xl"] + SPACING.sm,
  },
  centeredPromptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
});

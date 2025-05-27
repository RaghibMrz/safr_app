import { StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  trackContainer: {
    width: "90%",
    height: 40,
    justifyContent: "center",
    position: "relative",
    marginBottom: SPACING.sm,
  },
  track: {
    width: "100%",
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  markerContainer: {
    position: "absolute",
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  marker: {
    width: SPACING["3xl"],
    height: SPACING["3xl"],
    borderRadius: SPACING["3xl"] / 2,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.surface,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    color: COLORS.textOnPrimary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  currentScoreContainer: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.xs,
  },
  currentScoreText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  instructionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
});

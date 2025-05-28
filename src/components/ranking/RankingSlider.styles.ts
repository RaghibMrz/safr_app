// src/components/ranking/RankingSlider.styles.ts
import { StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.lg, // Consistent margin
  },
  trackContainer: {
    width: "90%", // Or '100%' if container has padding
    height: 40,
    justifyContent: "center",
    position: "relative",
    marginBottom: SPACING.sm,
  },
  track: {
    width: "100%",
    height: 8,
    backgroundColor: COLORS.border, // Softer track color
    borderRadius: 4,
  },
  trackHalo: {
    position: "absolute",
    left: -SPACING.sm, // Halo extends beyond track
    right: -SPACING.sm,
    top: -SPACING.sm,
    bottom: -SPACING.sm,
    backgroundColor: COLORS.secondary,
    opacity: 0.4,
    borderRadius: SPACING.md, // Softer halo corners
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%", // Match trackContainer
    marginTop: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  markerContainer: {
    position: "absolute",
    // left: 0, // Positioned by transform
    justifyContent: "center",
    alignItems: "center",
    // The marker itself will define its size
    width: SPACING["3xl"], // Hit area for marker if needed, matches visual marker
    height: SPACING["3xl"],
  },
  marker: {
    width: SPACING.xl + SPACING.xs, // 24px marker
    height: SPACING.xl + SPACING.xs, // 24px marker
    borderRadius: (SPACING.xl + SPACING.xs) / 2,
    backgroundColor: COLORS.primary,
    borderWidth: 2, // Thinner border
    borderColor: COLORS.surface,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Softer shadow
    shadowRadius: 3,
    elevation: 4,
  },
  // markerText removed, as DraggableSymbol shows the initial
  instructionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
});

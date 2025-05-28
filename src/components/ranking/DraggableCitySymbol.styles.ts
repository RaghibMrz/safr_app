// src/components/ranking/DraggableCitySymbol.styles.ts
import { StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../theme"; // Adjust path

export const styles = StyleSheet.create({
  container: {
    // This is the Animated.View that gets positioned
    // Size is determined by the symbol style inside
    // It needs to be easily centered by its coordinates
  },
  symbol: {
    width: 60, // Slightly larger for better touch and visual presence
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary, // Use a strong accent
    alignItems: "center",
    justifyContent: "center",
    // Enhanced shadow for a more "physical" feel
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.surface, // White border for pop
  },
  symbolText: {
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    fontSize: TYPOGRAPHY.sizes.h3, // Larger initial
    color: COLORS.textOnPrimary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  // No selectedCityNameText here, parent will handle that if needed
});

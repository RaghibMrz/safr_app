import React from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

// Ensure this path is correct based on your project structure.
// If app/index.tsx is at safr_app/app/index.tsx,
// and your theme is at safr_app/src/theme/, then ../src/theme is correct.
import { COLORS } from "../src/theme";

export default function AppRootIndex() {
  // The main redirection logic based on authentication status
  // is handled by your root layout file (app/_layout.tsx).
  // This index.tsx screen acts as the initial entry point that _layout.tsx wraps.
  // It should ideally not be visible for more than a fraction of a second.
  // Displaying a loading indicator here is a safe default.

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});

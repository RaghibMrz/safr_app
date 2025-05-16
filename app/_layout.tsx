// app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AuthContext, AuthProvider } from "../src/context/AuthContext";
import { COLORS, SPACING, TYPOGRAPHY } from "../src/theme";

// This is the component that contains the main logic for loading and redirection
function InitialLayout() {
  const authContext = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authContext?.isLoading) {
      return; // Don't navigate while still loading auth state
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (authContext?.userToken) {
      // User is signed in
      if (inAuthGroup) {
        // If in auth group (e.g. login page), redirect to main app (tabs)
        router.replace("/(tabs)/home");
      }
    } else {
      // User is not signed in
      if (!inAuthGroup) {
        // If not in auth group (e.g. tried to access a tab directly), redirect to login
        router.replace("/(auth)/login");
      }
    }
  }, [authContext?.isLoading, authContext?.userToken, segments, router]);

  if (authContext?.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
          backgroundColor={COLORS.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Safr...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // This Stack is the root navigator for your app.
  // It will render either the (auth) or (tabs) group based on the redirection logic.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      {/* Expo Router automatically handles a "+not-found" screen if you create one */}
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  );
}

// This is the component that Expo Router will render as the root layout.
// It provides the AuthContext to the rest of the application.
export default function RootAppLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
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
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
  },
});

// app/_layout.tsx
import React, { useContext, useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../src/theme";
import { setAuthLogoutCallback } from "../src/api";

function InitialLayout() {
  const authContext = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authContext?.logout) {
      setAuthLogoutCallback(authContext.logout);
    }
  }, [authContext?.logout]);

  useEffect(() => {
    if (!authContext) {
      console.error("AuthContext not available");
      return;
    }

    if (authContext.isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const isAtRoot = segments[0] === "_sitemap" || !segments[0];

    if (authContext.userToken) {
      // User is signed in
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      } else if (isAtRoot) {
        // User is at root, redirect to tabs
        router.replace("/(tabs)/home");
      }
      // If already in tabs, do nothing
    } else {
      // User is not signed in
      if (!inAuthGroup && !isAtRoot) {
        router.replace("/(auth)/login");
      } else if (isAtRoot) {
        router.replace("/(auth)/login");
      }
    }
  }, [authContext?.isLoading, authContext?.userToken, segments, router]);

  // Show loading screen while auth state is being determined
  if (!authContext || authContext.isLoading) {
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootAppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </GestureHandlerRootView>
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

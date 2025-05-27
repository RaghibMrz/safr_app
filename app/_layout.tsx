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
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView

import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../src/theme";

function InitialLayout() {
  const authContext = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authContext?.isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (authContext?.userToken) {
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      }
    } else {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [authContext?.isLoading, authContext?.userToken, segments, router]);

  if (authContext?.isLoading) {
    return (
      // SafeAreaView for loading state should also be inside GestureHandlerRootView
      // but for simplicity, we'll ensure the main content stack is wrapped.
      // The loading screen itself doesn't use gestures.
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

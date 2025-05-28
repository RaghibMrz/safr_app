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
import { DraxProvider } from "react-native-drax";

import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../src/theme"; // Ensure this path is correct & theme exports are valid

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
      <DraxProvider>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </DraxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background || "#F9F6F2", // Fallback color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background || "#F9F6F2", // Fallback color
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary || "#5D4037", // Fallback color
  },
});

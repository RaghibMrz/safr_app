// safr_app/App.tsx
import { ExpoRoot } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  // This tells Expo Router to look for files in the ./app directory.
  // @ts-ignore
  const ctx = require.context("./app");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExpoRoot context={ctx} />
    </GestureHandlerRootView>
  );
}

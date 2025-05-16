// safr_app/App.tsx
import { ExpoRoot } from "expo-router";
import React from "react";
import "react-native-gesture-handler"; // Still good to have at the very top

export default function App() {
  // This tells Expo Router to look for files in the ./app directory.
  // The require.context is a Webpack/Metro feature.
  // @ts-ignore
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

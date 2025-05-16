import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native"; // Added StyleSheet
import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../src/theme"; // Path to your theme

// Placeholder for icons - you would replace these with actual icon components
const TabBarIcon = ({
  name,
  color,
  focused,
}: {
  name: string;
  color: string;
  focused: boolean;
}) => {
  // This is a very basic text icon. Replace with <Ionicons name="..." /> or similar.
  return (
    <View style={styles.tabIconContainer}>
      <Text
        style={{
          color: focused ? COLORS.primary : color,
          fontSize: focused ? 12 : 10,
          fontWeight: focused ? FONT_WEIGHTS.bold : FONT_WEIGHTS.regular,
        }}
      >
        {name}
      </Text>
      {focused && <View style={styles.tabFocusedIndicator} />}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Screens within tabs will manage their own headers or have none
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface, // White background for tab bar
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height:
            Platform.OS === "ios"
              ? SPACING["5xl"] + SPACING.sm
              : SPACING["5xl"], // Adjust height
          paddingBottom: Platform.OS === "ios" ? SPACING.md : SPACING.xs, // Padding for labels
          paddingTop: SPACING.xs,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.sizes.xs,
          fontFamily: TYPOGRAPHY.fontFamilyMedium,
          fontWeight: FONT_WEIGHTS.medium,
          marginBottom: Platform.OS === "ios" ? -SPACING.xs : 0, // Adjust label position
        },
      }}
    >
      <Tabs.Screen
        name="home" // This will look for app/(tabs)/home.tsx
        options={{
          title: "My Rankings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="Home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="addRanking" // This will look for app/(tabs)/addRanking.tsx
        options={{
          title: "Rank City",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="Rank" color={color} focused={focused} />
          ),
        }}
      />
      {/* Example for a future Profile tab:
      <Tabs.Screen
        name="profile" // This will look for app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="Profile" color={color} focused={focused} />
          ),
        }}
      />
      */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? SPACING.xs : 0,
  },
  tabFocusedIndicator: {
    // Simple dot indicator for focused tab
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xs / 2,
  },
});

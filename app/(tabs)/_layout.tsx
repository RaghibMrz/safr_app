// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

import { COLORS, FONT_WEIGHTS, SPACING, TYPOGRAPHY } from "../../src/theme";

// Updated TabBarIcon to use Ionicons
const TabBarIcon = ({
  name,
  color,
  focused,
  size = 26,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
}) => {
  return (
    // The View container might not be strictly necessary if the icon itself has enough presence
    // but can be used for additional styling like a focused indicator dot if desired later.
    <View style={styles.tabIconContainer}>
      <Ionicons name={name} size={focused ? size + 2 : size} color={color} />
    </View>
  );
};

export default function TabLayout() {
  const commonTabHeight =
    Platform.OS === "ios"
      ? SPACING["5xl"] + SPACING.xs
      : SPACING["5xl"] + SPACING.sm;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth:
            Platform.OS === "android" ? 0 : StyleSheet.hairlineWidth,
          borderTopColor: COLORS.border,
          height: commonTabHeight,
          paddingTop: SPACING.xs,
          paddingBottom: Platform.OS === "ios" ? SPACING.sm : SPACING.xs,
          elevation: Platform.OS === "android" ? 8 : 0,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: TYPOGRAPHY.fontFamilyMedium,
          fontSize: TYPOGRAPHY.sizes.xs,
          fontWeight: FONT_WEIGHTS.medium,
          lineHeight: TYPOGRAPHY.sizes.xs * 1.2,
          marginBottom: Platform.OS === "ios" ? 0 : SPACING.xs / 2,
          marginTop: 0,
        },
        tabBarItemStyle: {
          // Style for the individual tab item (icon + label container)
          // Allow icon and label to naturally space themselves.
          // Vertical padding can be controlled by tabBarStyle's paddingTop/Bottom.
        },
        tabBarIconStyle: {
          // This style applies to the container view Expo Router wraps around your tabBarIcon component.
          // We don't want the icon to be pushed down by default top margin on Android.
          marginTop: -SPACING.sm / 1.5,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list-circle" : "list-circle-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="addRanking"
        options={{
          title: "Rank", // Short, clear label
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      {/* Example for a future Profile tab:
      <Tabs.Screen
        name="profile" // This will look for app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "person-circle" : "person-circle-outline"} 
              color={color} 
              focused={focused} 
            />
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
    paddingTop: SPACING.xxs,
    // The icon component itself will determine its size.
    // No flex: 1 needed here, as it might fight with the label for space.
  },
  // Optional: if you want a small dot under the active icon
  // tabFocusedIndicator: {
  //   width: 5,
  //   height: 5,
  //   borderRadius: 2.5,
  //   backgroundColor: COLORS.primary,
  //   marginTop: SPACING.xxs, // Small space between icon and dot
  // },
});

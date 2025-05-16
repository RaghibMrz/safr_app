// src/navigation/types.ts
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// For Expo Router, screen props are often inferred or can be typed
// based on the route parameters defined in the file system.
// However, defining ParamLists is still a good practice for type safety
// when using router.push or Link with parameters.

// --- Authentication Stack ---
// Defines the routes and any parameters they expect within the (auth) group.
export type AuthStackParamList = {
  login: undefined; // The 'login' screen takes no parameters.
  signup: undefined; // The 'signup' screen takes no parameters.
  // Add other auth-related screens here if needed, e.g., forgotPassword: { email?: string };
};

// Screen prop types for the Auth stack
// These can be used in your app/(auth)/login.tsx and app/(auth)/signup.tsx
export type AuthScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, Screen>;
// Note: If using Expo Router's own typed navigation hooks like `useLocalSearchParams`,
// you might not always need to explicitly type screen props this way, but it can be helpful.

// --- Main Application Tabs ---
// Defines the routes (tabs) and any parameters they expect within the (tabs) group.
export type MainTabsParamList = {
  home: undefined; // The 'home' tab screen takes no parameters.
  addRanking: undefined; // The 'addRanking' tab screen takes no parameters.
  // Example: If addRanking could be opened with a pre-selected city:
  // addRanking: { cityId?: number; cityName?: string } | undefined;
  profile: undefined; // Future 'profile' tab.
  // Add other main app tabs here
};

// Screen prop types for the Main Tabs stack
// These can be used in your app/(tabs)/home.tsx, app/(tabs)/addRanking.tsx, etc.
export type MainTabsScreenProps<Screen extends keyof MainTabsParamList> =
  NativeStackScreenProps<MainTabsParamList, Screen>;
// Again, Expo Router's typed hooks might provide alternatives for accessing params.

// --- Root Stack (if you have one defined in app/_layout.tsx that can navigate to these groups) ---
// This defines the top-level navigators as screens themselves.
// This is particularly relevant if you're using Stack.Screen name="(auth)" etc.
export type RootStackParamList = {
  "(auth)": undefined; // Navigating to the auth group
  "(tabs)": undefined; // Navigating to the tabs group
  // Add any other top-level screens or modals here, e.g.,
  // modal: undefined;
  // notFound: undefined; // For a custom 404 screen
};

// If you need to type props for screens that are part of the RootStack itself
// (though usually these are group navigators handled by _layout.tsx files)
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

// --- Combined type for all possible Href strings for Expo Router's Link/router ---
// This helps ensure type safety when using router.push or <Link href="...">.
// Expo Router v3+ has improved built-in Href typing, but this can be a manual way.
// This list should ideally match all your file-based routes.
export type AppHref =
  | `/${keyof AuthStackParamList}` // For routes like /login, /signup if not in a group
  | `/(${keyof RootStackParamList})/${string}` // For routes like /(auth)/login or /(tabs)/home
  | `/(${keyof RootStackParamList})`
  | "/"; // For the root index route

// Example of a more specific Href type if you want to list all known paths:
// export type AppScreenPaths =
//   | '/(auth)/login'
//   | '/(auth)/signup'
//   | '/(tabs)/home'
//   | '/(tabs)/addRanking'
//   | '/(tabs)/profile';
// This can be useful for ensuring Link hrefs are always valid.
// Expo Router's generated types in .expo/types/router.d.ts aim to provide this automatically.

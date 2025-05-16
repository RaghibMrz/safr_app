// app/(auth)/signup.tsx
import { Link, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "../../src/context/AuthContext"; // Path to AuthContext
import { styles } from "../../src/screens/auth/signup.styles"; // Import styles from co-located .styles.ts
import { COLORS } from "../../src/theme"; // Path to theme colors

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter(); // For navigation if needed after signup, e.g., to login

  if (!authContext) {
    console.error(
      "AuthContext is not available in SignupScreen. Ensure AuthProvider wraps the app."
    );
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainerCentered}>
          <Text style={{ color: COLORS.error }}>
            Authentication service is currently unavailable.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  const { signup } = authContext;

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    // Basic email validation (can be more robust)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      // Example: enforce minimum password length
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await signup(username, email, password);
      Alert.alert(
        "Signup Successful!",
        "You can now log in with your new account.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }] // Navigate to login
      );
    } catch (e: any) {
      setError(e.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.logoText}>safr</Text>
          <Text style={styles.title}>create your account</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={COLORS.placeholder}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            textContentType="username"
            autoComplete="username"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min. 6 characters)"
            placeholderTextColor={COLORS.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword" // Helps with password manager suggestions
            autoComplete="password-new"
            returnKeyType="done"
            onSubmitEditing={handleSignup}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextPrimary}>Sign Up</Text>
            </TouchableOpacity>
          )}

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity
              style={styles.switchAuthLinkContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

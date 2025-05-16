// app/(auth)/login.tsx
import { Link, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "../../src/context/AuthContext";
import { styles } from "../../src/screens/auth/login.styles";
import { COLORS } from "../../src/theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    console.error(
      "AuthContext is not available in LoginScreen. Ensure AuthProvider wraps the app."
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
  const { login } = authContext;

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (e: any) {
      setError(
        e.message ||
          "Login failed. Please check your credentials and try again."
      );
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
          <Text style={styles.title}>welcome traveller</Text>

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
            onSubmitEditing={() => {
              /* Optionally focus next input */
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
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
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextPrimary}>Login</Text>
            </TouchableOpacity>
          )}

          {/* Using Link component from expo-router for navigation */}
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity
              style={styles.switchAuthLinkContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text style={styles.linkTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
import { Alert } from "../../src/components/common/Alert";
import { styles } from "../../src/screens/auth/login.styles";
import { COLORS } from "../../src/theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "error"
  );

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

  const showAlert = (message: string, type: "success" | "error" | "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim()) {
      showAlert("Please enter your username.", "error");
      return;
    }

    if (!password) {
      showAlert("Please enter your password.", "error");
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      // Navigation will be handled by the root layout based on auth state
    } catch (e: any) {
      console.error("Login error:", e);
      // Display the error message from the API
      const errorMessage =
        e.message ||
        "Login failed. Please check your credentials and try again.";
      showAlert(errorMessage, "error");
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

      <Alert
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.logoText}>safr</Text>
          <Text style={styles.title}>welcome traveller</Text>

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
            editable={!loading}
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
            editable={!loading}
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
              disabled={loading}
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

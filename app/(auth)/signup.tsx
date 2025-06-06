// app/(auth)/signup.tsx
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
import { styles } from "../../src/screens/auth/signup.styles";
import { COLORS } from "../../src/theme";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
    console.error("AuthContext is not available in SignupScreen.");
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

  const showAlert = (message: string, type: "success" | "error" | "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleSignup = async () => {
    if (!username.trim()) {
      showAlert("Please enter a username.", "error");
      return;
    }

    if (!email.trim()) {
      showAlert("Please enter an email address.", "error");
      return;
    }

    if (!password) {
      showAlert("Please enter a password.", "error");
      return;
    }

    setLoading(true);
    try {
      await signup(username.trim(), email.trim(), password);
      showAlert("Account created successfully! Please log in.", "success");
      // Wait a bit before navigating to login
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch (e: any) {
      console.error("Signup error:", e);
      const errorMessage =
        e.message || "Failed to create account. Please try again.";
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
          <Text style={styles.title}>create your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={COLORS.placeholder}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            textContentType="username"
            autoComplete="username-new"
            returnKeyType="next"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            autoComplete="email"
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
            textContentType="newPassword"
            autoComplete="password-new"
            returnKeyType="done"
            onSubmitEditing={handleSignup}
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
              disabled={loading}
            >
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkTextBold}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

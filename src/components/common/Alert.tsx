// src/components/common/Alert.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING } from "../../theme";

interface AlertProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  duration?: number;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  type,
  visible,
  duration = 4000,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          hideAlert();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  const getAlertStyle = () => {
    switch (type) {
      case "success":
        return { backgroundColor: COLORS.success };
      case "error":
        return { backgroundColor: COLORS.error };
      case "info":
        return { backgroundColor: COLORS.primary };
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "info":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getAlertStyle(),
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Ionicons name={getIcon()} size={24} color={COLORS.white} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: SPACING.lg,
    right: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  message: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
    marginLeft: SPACING.sm,
    flex: 1,
  },
});

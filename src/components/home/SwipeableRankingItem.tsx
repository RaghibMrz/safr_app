// src/components/home/SwipeableRankingItem.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS } from "../../theme";
import { styles } from "@/src/screens/tabs/home.styles";
import { SwipeableRankingItemProps } from "@/src/types/ranking";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = -120;
const DELETE_BUTTON_WIDTH = 80;

export const SwipeableRankingItem: React.FC<SwipeableRankingItemProps> = ({
  item,
  onDelete,
  index,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteButtonOpacity = useRef(new Animated.Value(0)).current;
  const itemOpacity = useRef(new Animated.Value(1)).current;

  // Simple fade-in on mount
  React.useEffect(() => {
    itemOpacity.setValue(0);
    Animated.timing(itemOpacity, {
      toValue: 1,
      duration: 300,
      delay: index * 50, // Stagger animation
      useNativeDriver: true,
    }).start();
  }, [index]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
          // Fade in delete button as user swipes
          const opacity = Math.min(
            1,
            Math.abs(gestureState.dx) / DELETE_BUTTON_WIDTH
          );
          deleteButtonOpacity.setValue(opacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          // Swipe far enough - trigger delete
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(itemOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDelete(item);
          });
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 7,
              useNativeDriver: true,
            }),
            Animated.timing(deleteButtonOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4CAF50"; // Green
    if (score >= 60) return "#FFC107"; // Amber
    if (score >= 40) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: itemOpacity,
        },
      ]}
    >
      {/* Delete button background */}
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          {
            opacity: deleteButtonOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main content */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.contentContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.rankingContent}>
          <View style={styles.leftSection}>
            <View
              style={[
                styles.scoreCircle,
                { borderColor: getScoreColor(item.personal_score) },
              ]}
            >
              <Text
                style={[
                  styles.scoreText,
                  { color: getScoreColor(item.personal_score) },
                ]}
              >
                {Math.round(item.personal_score)}
              </Text>
            </View>
          </View>

          <View style={styles.middleSection}>
            <Text style={styles.cityName} numberOfLines={1}>
              {item.city.name}
            </Text>
            <View style={styles.countryContainer}>
              <Ionicons
                name="location-outline"
                size={14}
                color={COLORS.textMuted}
              />
              <Text style={styles.countryText}>{item.city.country}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Ionicons name="chevron-back" size={20} color={COLORS.textMuted} />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

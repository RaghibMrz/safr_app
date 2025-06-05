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
  Platform,
} from "react-native";
import { COLORS, FONT_SIZES } from "../../theme";
import { styles } from "@/src/screens/tabs/home.styles";
import { SwipeableRankingItemProps } from "@/src/types/ranking";
import {
  ANIMATION_DURATION_FADE,
  PAN_ACTIVATION_OFFSET,
  STAGGER_DELAY_MS,
} from "@/src/screens/tabs/home.constants";
import { SCORE_MARKERS } from "@/src/screens/tabs/addRanking.constants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = -120;
const DELETE_BUTTON_WIDTH = 80;

export const SwipeableRankingItem: React.FC<
  SwipeableRankingItemProps & {
    onSwipeStart?: () => void;
    onSwipeEnd?: () => void;
  }
> = ({ item, onDelete, index, onSwipeStart, onSwipeEnd }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteButtonOpacity = useRef(new Animated.Value(0)).current;
  const itemOpacity = useRef(new Animated.Value(0)).current;

  // Fade-in on mount
  React.useEffect(() => {
    Animated.timing(itemOpacity, {
      toValue: 1,
      duration: ANIMATION_DURATION_FADE,
      delay: index * STAGGER_DELAY_MS,
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // More permissive for iOS
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const hasMinimumDistance =
          Math.abs(gestureState.dx) > PAN_ACTIVATION_OFFSET;
        return isHorizontalSwipe && hasMinimumDistance;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Capture horizontal swipes to prevent scroll interference
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const hasMinimumDistance =
          Math.abs(gestureState.dx) > PAN_ACTIVATION_OFFSET;
        return isHorizontalSwipe && hasMinimumDistance;
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        onSwipeStart?.();
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
        onSwipeEnd?.();
        if (gestureState.dx < SWIPE_THRESHOLD) {
          // Swipe far enough - trigger delete
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(itemOpacity, {
              toValue: 0,
              duration: 250,
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
              tension: 40,
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
    if (score >= SCORE_MARKERS[3]) return COLORS.scoreHigh;
    if (score >= SCORE_MARKERS[2]) return COLORS.scoreMediumHigh;
    if (score >= SCORE_MARKERS[1]) return COLORS.scoreMediumLow;
    return COLORS.scoreLow;
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
          <Ionicons
            name="trash-outline"
            size={FONT_SIZES.xl3}
            color={COLORS.white}
          />
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
                size={FONT_SIZES.sm}
                color={COLORS.textMuted}
              />
              <Text style={styles.countryText}>{item.city.country}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Ionicons
              name="chevron-back"
              size={FONT_SIZES.xl}
              color={COLORS.textMuted}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

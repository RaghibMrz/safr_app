// src/components/ranking/DraggableCity.tsx
import { Ionicons } from "@expo/vector-icons";
import { Animated, Text, TouchableOpacity, View, Platform } from "react-native";

import {
  CITY_ICON_SIZE,
  ELEVATION_DEFAULT,
  ELEVATION_DRAGGING,
  REMOVE_BUTTON_OFFSET,
  SCORE_MARKERS,
  WIDGET_CITY_NAME_MAX_LENGTH,
  Z_INDEX_DRAGGING,
  Z_INDEX_ITEM_DEFAULT,
  Z_INDEX_ITEM_SCORED,
} from "../../screens/tabs/addRanking.constants";
import { COLORS, FONT_SIZES } from "../../theme";
import { DraggableCityProps } from "@/src/types/city";
import { styles } from "@/src/screens/tabs/addRanking.styles";

export const DraggableCity: React.FC<DraggableCityProps> = ({
  city,
  position,
  isDragging,
  panResponder,
  onRemove,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= SCORE_MARKERS[3]) return COLORS.scoreHigh;
    if (score >= SCORE_MARKERS[2]) return COLORS.scoreMediumHigh;
    if (score >= SCORE_MARKERS[1]) return COLORS.scoreMediumLow;
    return COLORS.scoreLow;
  };

  const isRanked = city.score !== null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          transform: position
            ? [{ translateX: position.x }, { translateY: position.y }]
            : [],
          zIndex: isDragging
            ? Z_INDEX_DRAGGING
            : isRanked
            ? Z_INDEX_ITEM_SCORED
            : Z_INDEX_ITEM_DEFAULT,
          elevation: isDragging ? ELEVATION_DRAGGING : ELEVATION_DEFAULT,
          width: CITY_ICON_SIZE,
          height: CITY_ICON_SIZE,
        },
      ]}
      // Prevent this view from interfering with ScrollView on iOS
      pointerEvents={isDragging ? "box-none" : "auto"}
    >
      <View
        style={[
          styles.cityIcon,
          {
            backgroundColor: city.color,
            transform: isDragging ? [{ scale: 1.1 }] : [{ scale: 1 }],
            borderWidth: isRanked ? 3 : 0,
            borderColor: isRanked
              ? getScoreColor(city.score as number)
              : "transparent",
            // Add shadow for better visibility on iOS
            ...(Platform.OS === "ios" && isDragging
              ? {
                  shadowColor: COLORS.shadow,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                }
              : {}),
          },
        ]}
        {...panResponder}
      >
        <Text style={styles.cityIconText} numberOfLines={1}>
          {city.name.substring(0, WIDGET_CITY_NAME_MAX_LENGTH).toUpperCase()}
        </Text>
        {isRanked && (
          <View
            style={[
              styles.scoreContainer,
              { backgroundColor: getScoreColor(city.score as number) },
            ]}
          >
            <Text style={styles.cityScoreText}>{city.score}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.removeCityButton,
          {
            position: "absolute",
            right: 0,
            top: 0,
            transform: [
              { translateX: REMOVE_BUTTON_OFFSET.x },
              { translateY: REMOVE_BUTTON_OFFSET.y },
            ],
            // Better touch target on iOS
            ...(Platform.OS === "ios"
              ? {
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {}),
          },
        ]}
        onPress={() => onRemove(city.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="close-circle"
          size={FONT_SIZES.xl}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

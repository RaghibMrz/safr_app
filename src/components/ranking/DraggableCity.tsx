// src/components/ranking/DraggableCity.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import {
  CITY_ICON_SIZE,
  REMOVE_BUTTON_OFFSET,
  WIDGET_CITY_NAME_MAX_LENGTH,
} from "../../screens/tabs/addRanking.constants";
import { COLORS, SPACING, TYPOGRAPHY, FONT_WEIGHTS } from "../../theme";
import { DraggableCityProps } from "@/src/types/city";

export const DraggableCity: React.FC<DraggableCityProps> = ({
  city,
  position,
  isDragging,
  panResponder,
  onRemove,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#FFC107";
    if (score >= 40) return "#FF9800";
    return "#F44336";
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          position: "absolute",
          transform: position
            ? [{ translateX: position.x }, { translateY: position.y }]
            : [],
          zIndex: isDragging ? 1000 : city.score > 0 ? 10 : 1,
          elevation: isDragging ? 10 : 5,
          width: CITY_ICON_SIZE,
          height: CITY_ICON_SIZE,
        },
      ]}
    >
      <View
        style={[
          styles.cityIcon,
          {
            backgroundColor: city.color,
            transform: isDragging ? [{ scale: 1.1 }] : [{ scale: 1 }],
            borderWidth: city.score > 0 ? 3 : 0,
            borderColor:
              city.score > 0 ? getScoreColor(city.score) : "transparent",
          },
        ]}
        {...panResponder}
      >
        <Text style={styles.cityIconText} numberOfLines={1}>
          {city.name.substring(0, WIDGET_CITY_NAME_MAX_LENGTH).toUpperCase()}
        </Text>
        {city.score > 0 && (
          <View
            style={[
              styles.scoreContainer,
              { backgroundColor: getScoreColor(city.score) },
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
          },
        ]}
        onPress={() => onRemove(city.id)}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <Ionicons name="close-circle" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles handled inline
  },
  cityIcon: {
    width: CITY_ICON_SIZE,
    height: CITY_ICON_SIZE,
    borderRadius: CITY_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    position: "absolute",
    left: 0,
    top: 0,
  },
  cityIconText: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scoreContainer: {
    position: "absolute",
    bottom: -5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 10,
    minWidth: 30,
    alignItems: "center",
  },
  cityScoreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  removeCityButton: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

// src/components/ranking/DraggableCity.tsx
import { Ionicons } from "@expo/vector-icons";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import {
  CITY_ICON_SIZE,
  REMOVE_BUTTON_OFFSET,
  SCORE_MARKERS,
  WIDGET_CITY_NAME_MAX_LENGTH,
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
    if (score >= SCORE_MARKERS[3]) return "#4CAF50";
    if (score >= SCORE_MARKERS[2]) return "#FFC107";
    if (score >= SCORE_MARKERS[1]) return "#FF9800";
    return "#F44336";
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          transform: position
            ? [{ translateX: position.x }, { translateY: position.y }]
            : [],
          zIndex: isDragging ? 1000 : city.score > 0 ? 100 : 50,
          elevation: isDragging ? 20 : 10,
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
        <Ionicons
          name="close-circle"
          size={FONT_SIZES.xl}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

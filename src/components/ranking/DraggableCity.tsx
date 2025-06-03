// src/components/DraggableCity.tsx
import { Ionicons } from "@expo/vector-icons";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import { styles } from "../../screens/tabs/addRanking.styles";
import {
  CITY_ICON_SIZE,
  REMOVE_BUTTON_OFFSET,
  WIDGET_CITY_NAME_MAX_LENGTH,
} from "../../screens/tabs/addRanking.constants";
import { COLORS } from "../../theme";
import { DraggableCityProps } from "@/src/types/city";

export const DraggableCity: React.FC<DraggableCityProps> = ({
  city,
  position,
  isDragging,
  panResponder,
  onRemove,
}) => {
  return (
    <Animated.View
      style={[
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
        style={[styles.cityIcon, { backgroundColor: city.color }]}
        {...panResponder}
      >
        <Text style={styles.cityIconText} numberOfLines={1}>
          {city.name.substring(0, WIDGET_CITY_NAME_MAX_LENGTH).toUpperCase()}
        </Text>
        {city.score > 0 && (
          <Text style={styles.cityScoreText}>{city.score}</Text>
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
          size={styles.removeCityButton.size}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

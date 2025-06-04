import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import { COLORS, FONT_SIZES } from "../../theme";
import { searchModalStyles } from "../../screens/tabs/addRanking.styles";
import { City } from "@/src/types/city";

interface SearchResultItemProps {
  item: City;
  onSelectCity: (city: City) => void;
  // If you later add animations for individual items, you might pass Animated.Value here
  // For now, the opacity and translateX in SearchModal's renderSearchResult were static,
  // so we won't replicate that Animated.View unless needed for dynamic animations.
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  onSelectCity,
}) => {
  return (
    // If you need per-item animations, consider passing an Animated.Value via props
    // or creating an Animated.Value per item in SearchModal and passing it here.
    // For now, we'll remove the Animated.View wrapper from the original snippet
    // unless it serves a dynamic animation purpose you haven't specified.
    <TouchableOpacity
      style={searchModalStyles.searchResultItem}
      onPress={() => onSelectCity(item)}
      activeOpacity={0.7}
    >
      <View style={searchModalStyles.cityIconSmall}>
        <Text style={searchModalStyles.cityInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={searchModalStyles.cityInfo}>
        <Text style={searchModalStyles.cityName}>{item.name}</Text>
        <View style={searchModalStyles.countryRow}>
          <Ionicons
            name="location-outline"
            size={FONT_SIZES.xs}
            color={COLORS.textMuted}
          />
          <Text style={searchModalStyles.countryName}>{item.country}</Text>
        </View>
      </View>
      <View style={searchModalStyles.addButton}>
        <Ionicons name="add" size={FONT_SIZES.xl3} color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

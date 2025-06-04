// src/components/ranking/SearchModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { COLORS, FONT_SIZES } from "../../theme";
import { City } from "@/src/types/city";
import { searchModalStyles } from "@/src/screens/tabs/addRanking.styles";

interface SearchModalProps {
  visible: boolean;
  searchTerm: string;
  onSearchTermChange: (text: string) => void;
  onClose: () => void;
  onSelectCity: (city: City) => void;
  displayedCities: City[];
  isLoading: boolean;
  modalOpacity: Animated.Value;
  modalTranslateY: Animated.Value;
}

export const SearchModal = forwardRef<TextInput, SearchModalProps>(
  (
    {
      visible,
      searchTerm,
      onSearchTermChange,
      onClose,
      onSelectCity,
      displayedCities,
      isLoading,
      modalOpacity,
      modalTranslateY,
    },
    ref
  ) => {
    const renderSearchResult = ({
      item,
      index,
    }: {
      item: City;
      index: number;
    }) => (
      <Animated.View
        style={{
          opacity: 1,
          transform: [{ translateX: 0 }],
        }}
      >
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
            <Ionicons name="add" size={FONT_SIZES.xxl} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );

    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={onClose}
      >
        <Animated.View
          style={[searchModalStyles.modalBackdrop, { opacity: modalOpacity }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            searchModalStyles.modalContent,
            { transform: [{ translateY: modalTranslateY }] },
          ]}
        >
          <View style={searchModalStyles.modalHandle} />

          <View style={searchModalStyles.modalHeader}>
            <Text style={searchModalStyles.modalTitle}>Search Cities</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={searchModalStyles.closeButton}
            >
              <Ionicons
                name="close"
                size={FONT_SIZES.xxl}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <View style={searchModalStyles.searchInputContainer}>
            <Ionicons
              name="search"
              size={FONT_SIZES.xl}
              color={COLORS.textMuted}
            />
            <TextInput
              ref={ref}
              style={searchModalStyles.modalSearchInput}
              placeholder="Type city name or country..."
              placeholderTextColor={COLORS.placeholder}
              value={searchTerm}
              onChangeText={onSearchTermChange}
              autoCapitalize="words"
              returnKeyType="search"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={() => onSearchTermChange("")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close-circle"
                  size={FONT_SIZES.xl}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={displayedCities}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            style={searchModalStyles.searchResultsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={searchModalStyles.listContent}
            ListEmptyComponent={
              searchTerm.trim() && !isLoading ? (
                <View style={searchModalStyles.noResultsContainer}>
                  <Ionicons
                    name="search"
                    size={FONT_SIZES.logo}
                    color={COLORS.textMuted}
                  />
                  <Text style={searchModalStyles.noResultsText}>
                    No cities found matching "{searchTerm}"
                  </Text>
                  <Text style={searchModalStyles.noResultsSubtext}>
                    Try searching for a different city or country
                  </Text>
                </View>
              ) : null
            }
          />
        </Animated.View>
      </Modal>
    );
  }
);

SearchModal.displayName = "SearchModal";

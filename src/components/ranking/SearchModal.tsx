// src/components/ranking/SearchModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { COLORS, FONT_SIZES, SPACING } from "../../theme";
import { City } from "@/src/types/city";
import { searchModalStyles } from "@/src/screens/tabs/addRanking.styles";
import { SearchResultItem } from "./SearchResultItem";

interface SearchModalProps {
  visible: boolean;
  searchTerm: string;
  onSearchTermChange: (text: string) => void;
  countryFilter?: string;
  onCountryFilterChange?: (text: string) => void;
  onClose: () => void;
  onSelectCity: (city: City) => void;
  displayedCities: City[];
  isLoading: boolean;
  searchError?: string;
  modalOpacity: Animated.Value;
  modalTranslateY: Animated.Value;
}

export const SearchModal = forwardRef<TextInput, SearchModalProps>(
  (
    {
      visible,
      searchTerm,
      onSearchTermChange,
      countryFilter = "",
      onCountryFilterChange,
      onClose,
      onSelectCity,
      displayedCities,
      isLoading,
      searchError,
      modalOpacity,
      modalTranslateY,
    },
    ref
  ) => {
    const renderSearchResult = ({ item }: { item: City }) => (
      <SearchResultItem item={item} onSelectCity={onSelectCity} />
    );

    const renderEmpty = () => {
      if (isLoading) {
        return (
          <View style={searchModalStyles.noResultsContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={searchModalStyles.noResultsText}>Searching...</Text>
          </View>
        );
      }

      if (searchError) {
        return (
          <View style={searchModalStyles.noResultsContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={FONT_SIZES.logo}
              color={COLORS.error}
            />
            <Text
              style={[searchModalStyles.noResultsText, { color: COLORS.error }]}
            >
              {searchError}
            </Text>
          </View>
        );
      }

      if (searchTerm.trim() || countryFilter) {
        return (
          <View style={searchModalStyles.noResultsContainer}>
            <Ionicons
              name="search"
              size={FONT_SIZES.logo}
              color={COLORS.textMuted}
            />
            <Text style={searchModalStyles.noResultsText}>No cities found</Text>
            <Text style={searchModalStyles.noResultsSubtext}>
              Try searching for a different city or country
            </Text>
          </View>
        );
      }

      return (
        <View style={searchModalStyles.noResultsContainer}>
          <Ionicons
            name="search"
            size={FONT_SIZES.logo}
            color={COLORS.textMuted}
          />
          <Text style={searchModalStyles.noResultsText}>Search for a city</Text>
          <Text style={searchModalStyles.noResultsSubtext}>
            Type a city name or filter by country
          </Text>
        </View>
      );
    };

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
                size={FONT_SIZES.xl3}
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
              placeholder="Type city name..."
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

          {onCountryFilterChange && (
            <View
              style={[
                searchModalStyles.searchInputContainer,
                { marginTop: SPACING.sm },
              ]}
            >
              <Ionicons
                name="earth"
                size={FONT_SIZES.xl}
                color={COLORS.textMuted}
              />
              <TextInput
                style={searchModalStyles.modalSearchInput}
                placeholder="Filter by country (optional)..."
                placeholderTextColor={COLORS.placeholder}
                value={countryFilter}
                onChangeText={onCountryFilterChange}
                autoCapitalize="words"
                returnKeyType="search"
              />
              {countryFilter.length > 0 && (
                <TouchableOpacity
                  onPress={() => onCountryFilterChange("")}
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
          )}

          <FlatList
            data={displayedCities}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            style={searchModalStyles.searchResultsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={searchModalStyles.listContent}
            ListEmptyComponent={renderEmpty}
          />
        </Animated.View>
      </Modal>
    );
  }
);

SearchModal.displayName = "SearchModal";

// src/components/SearchModal.tsx
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
} from "react-native";

import { styles } from "../../screens/tabs/addRanking.styles";
import { COLORS } from "../../theme";

interface City {
  id: number;
  name: string;
  country: string;
}

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
    const renderSearchResult = ({ item }: { item: City }) => (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => onSelectCity(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.searchResultText}>
          {item.name}, {item.country}
        </Text>
        <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    );

    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={onClose}
      >
        <Animated.View
          style={[styles.modalBackdrop, { opacity: modalOpacity }]}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: modalTranslateY }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Cities</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <TextInput
            ref={ref}
            style={styles.modalSearchInput}
            placeholder="Type city name..."
            placeholderTextColor={COLORS.placeholder}
            value={searchTerm}
            onChangeText={onSearchTermChange}
            autoCapitalize="words"
            returnKeyType="search"
          />

          <FlatList
            data={displayedCities}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            style={styles.searchResultsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              searchTerm.trim() && !isLoading ? (
                <Text style={styles.noResultsText}>
                  No cities found matching "{searchTerm}"
                </Text>
              ) : null
            }
          />
        </Animated.View>
      </Modal>
    );
  }
);

SearchModal.displayName = "SearchModal";

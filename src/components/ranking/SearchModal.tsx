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

import { COLORS, SPACING, TYPOGRAPHY, FONT_WEIGHTS } from "../../theme";
import { City } from "@/src/types/city";

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
          style={styles.searchResultItem}
          onPress={() => onSelectCity(item)}
          activeOpacity={0.7}
        >
          <View style={styles.cityIconSmall}>
            <Text style={styles.cityInitial}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{item.name}</Text>
            <View style={styles.countryRow}>
              <Ionicons
                name="location-outline"
                size={12}
                color={COLORS.textMuted}
              />
              <Text style={styles.countryName}>{item.country}</Text>
            </View>
          </View>
          <View style={styles.addButton}>
            <Ionicons name="add" size={24} color={COLORS.white} />
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
          style={[styles.modalBackdrop, { opacity: modalOpacity }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
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
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Cities</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              ref={ref}
              style={styles.modalSearchInput}
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
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={displayedCities}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            style={styles.searchResultsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              searchTerm.trim() && !isLoading ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search" size={48} color={COLORS.textMuted} />
                  <Text style={styles.noResultsText}>
                    No cities found matching "{searchTerm}"
                  </Text>
                  <Text style={styles.noResultsSubtext}>
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

const styles = StyleSheet.create({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SPACING.xl,
    borderTopRightRadius: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    height: "70%",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textMuted,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: SPACING.lg,
    opacity: 0.3,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textPrimary,
  },
  searchResultsList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cityIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cityInitial: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  cityInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cityName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  countryName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: SPACING["3xl"],
  },
  noResultsText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
  noResultsSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
});

// app/(tabs)/addRanking.tsx
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

import { AuthContext } from "../../src/context/AuthContext";
import apiService from "../../src/api";
import { COLORS, TYPOGRAPHY, SPACING } from "../../src/theme";
import { styles } from "../../src/screens/tabs/addRanking.styles";
import { RankingSlider } from "../../src/components/ranking/RankingSlider";

interface City {
  id: number;
  name: string;
  country: string;
}

interface RankingListHeaderProps {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  fetchError: string;
  isSubmitting: boolean;
}

const RankingListHeader: React.FC<RankingListHeaderProps> = React.memo(
  ({ searchTerm, setSearchTerm, fetchError, isSubmitting }) => {
    return (
      <View style={styles.listHeaderContainer}>
        {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}
        <Text style={styles.label}>Search and Select a City</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Type to search cities..."
          placeholderTextColor={COLORS.placeholder}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="words"
          returnKeyType="search"
          autoCorrect={false}
          spellCheck={false}
          editable={!isSubmitting}
        />
      </View>
    );
  }
);

interface RankingListFooterProps {
  selectedCity: City | null;
  score: number;
  onScoreChange: (newScore: number) => void;
  isSubmitting: boolean;
  isLoadingCities: boolean;
  submitError: string;
  handleAddOrUpdateRanking: () => Promise<void>;
  cityInitial?: string;
}

const RankingListFooter: React.FC<RankingListFooterProps> = React.memo(
  ({
    selectedCity,
    score,
    onScoreChange,
    isSubmitting,
    isLoadingCities,
    submitError,
    handleAddOrUpdateRanking,
    cityInitial,
  }) => {
    return (
      <View style={styles.listFooterContainer}>
        {selectedCity && (
          <Text style={styles.selectedCityText}>
            Selected: {selectedCity.name}, {selectedCity.country}
          </Text>
        )}
        <Text style={styles.label}>Set Your Personal Score (0-100)</Text>

        <RankingSlider
          initialScore={score}
          onScoreChange={onScoreChange}
          cityInitial={cityInitial}
          disabled={!selectedCity || isSubmitting}
        />

        {isSubmitting ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              !selectedCity && styles.buttonDisabled,
            ]}
            onPress={handleAddOrUpdateRanking}
            disabled={!selectedCity || isLoadingCities || isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextPrimary}>Submit Ranking</Text>
          </TouchableOpacity>
        )}
        {submitError && <Text style={styles.errorText}>{submitError}</Text>}
      </View>
    );
  }
);

export default function AddRankingScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // All useState, useCallback, useEffect, useMemo hooks MUST be called here,
  // before any conditional returns.
  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [score, setScore] = useState<number>(50);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const fetchCities = useCallback(async () => {
    setIsLoadingCities(true);
    setFetchError("");
    try {
      const cityData = await apiService.getCities(0, 500);
      setAllCities(cityData);
    } catch (e: any) {
      setFetchError(e.message || "Failed to load cities. Please try again.");
      setAllCities([]);
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const displayedCities = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!trimmedSearch) {
      return [];
    }
    return allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(trimmedSearch) ||
        city.country.toLowerCase().includes(trimmedSearch)
    );
  }, [allCities, debouncedSearchTerm]);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const cityInitialForSlider = useMemo(() => {
    // Moved this hook up
    return selectedCity ? selectedCity.name.charAt(0).toUpperCase() : undefined;
  }, [selectedCity]);

  // AuthContext check - if context is truly unavailable, it's a critical setup error.
  // This early return is for a catastrophic failure, not typical conditional rendering.
  if (!authContext) {
    console.error("AuthContext is not available in AddRankingScreen.");
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <Text style={{ color: COLORS.error }}>Service unavailable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddOrUpdateRanking = async () => {
    if (!selectedCity) {
      setSubmitError("Please select a city from the search results to rank.");
      return;
    }
    if (score < 0 || score > 100) {
      setSubmitError("Score must be between 0 and 100.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await apiService.addOrUpdateRanking(selectedCity.id, score);
      Alert.alert(
        "Ranking Submitted!",
        `Your score for ${selectedCity.name} has been saved.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSearchTerm("");
              setDebouncedSearchTerm("");
              setSelectedCity(null);
              setScore(50);
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (e: any) {
      setSubmitError(
        e.message || "Failed to submit ranking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCityPickerItem = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={[
        styles.cityPickerItem,
        selectedCity?.id === item.id && styles.cityPickerItemSelected,
      ]}
      onPress={() => {
        setSelectedCity(item);
        setScore(50);
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.cityPickerItemText}>
        {item.name}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  // Conditional rendering for loading state happens AFTER all hooks are called.
  if (isLoadingCities && allCities.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: SPACING.md, color: COLORS.textSecondary }}>
            Loading cities...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.screenContainer}>
          <FlatList
            data={displayedCities}
            renderItem={renderCityPickerItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.cityList}
            ListHeaderComponent={
              <RankingListHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                fetchError={fetchError}
                isSubmitting={isSubmitting}
              />
            }
            ListFooterComponent={
              <RankingListFooter
                selectedCity={selectedCity}
                score={score}
                onScoreChange={handleScoreChange}
                isSubmitting={isSubmitting}
                isLoadingCities={isLoadingCities}
                submitError={submitError}
                handleAddOrUpdateRanking={handleAddOrUpdateRanking}
                cityInitial={cityInitialForSlider}
              />
            }
            ListEmptyComponent={
              !isLoadingCities && debouncedSearchTerm.trim() ? (
                <View style={{ padding: SPACING.xl }}>
                  <Text style={styles.emptyText}>
                    No cities match "{debouncedSearchTerm}".
                  </Text>
                </View>
              ) : !isLoadingCities && !debouncedSearchTerm.trim() ? (
                <View style={{ padding: SPACING.xl }}>
                  <Text style={styles.emptyText}>
                    Start typing to search for a city.
                  </Text>
                  {fetchError && (
                    <Text style={styles.errorText}>{fetchError}</Text>
                  )}
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: SPACING.xl }}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

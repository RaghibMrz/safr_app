// app/(tabs)/addRanking.tsx
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import apiService from "../../src/api";
import { AuthContext } from "../../src/context/AuthContext";
import { styles } from "../../src/screens/tabs/addRanking.styles"; // Corrected path
import { COLORS, SPACING } from "../../src/theme";

interface City {
  id: number;
  name: string;
  country: string;
}

export default function AddRankingScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [score, setScore] = useState<string>("");
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const fetchCities = useCallback(async () => {
    setIsLoadingCities(true);
    setError("");
    try {
      // Fetch a larger list for client-side search. Adjust limit as needed.
      // For a truly global dataset, server-side search would be better.
      const cityData = await apiService.getCities(0, 500);
      setAllCities(cityData);
    } catch (e: any) {
      setError(e.message || "Failed to load cities. Please try again.");
      setAllCities([]);
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter cities based on debounced search term
  // Only show results if there is a search term
  const displayedCities = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!trimmedSearch) {
      return []; // Show no cities if search is empty
    }
    return allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(trimmedSearch) ||
        city.country.toLowerCase().includes(trimmedSearch)
    );
  }, [allCities, debouncedSearchTerm]);

  const handleAddOrUpdateRanking = async () => {
    if (!selectedCity) {
      setError("Please select a city from the search results to rank.");
      return;
    }
    if (!score.trim()) {
      setError("Please enter a score for the selected city.");
      return;
    }
    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      setError("Score must be a number between 0 and 100.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await apiService.addOrUpdateRanking(selectedCity.id, numericScore);
      Alert.alert(
        "Ranking Submitted!",
        `Your score for ${selectedCity.name} has been saved.`,
        // Explicitly redirect to home and ensure it's part of the (tabs) group
        [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
      );
    } catch (e: any) {
      setError(e.message || "Failed to submit ranking. Please try again.");
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
        // Optionally, you could clear the search term here or scroll to the selection
        // setSearchTerm(item.name); // This might re-trigger filtering, handle carefully
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.cityPickerItemText}>
        {item.name}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  // Memoize ListHeaderComponent to prevent unnecessary re-renders causing focus loss
  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.listHeaderContainer}>
        {error && !isSubmitting && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        <Text style={styles.label}>Search and Select a City</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Type to search cities..."
          placeholderTextColor={COLORS.placeholder}
          value={searchTerm}
          onChangeText={setSearchTerm} // Directly update searchTerm
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>
    ),
    [error, isSubmitting, searchTerm]
  ); // Dependencies for useCallback

  const ListFooterComponent = useCallback(
    () => (
      <View style={styles.listFooterContainer}>
        {selectedCity && (
          <Text style={styles.selectedCityText}>
            Selected: {selectedCity.name}, {selectedCity.country}
          </Text>
        )}
        <Text style={styles.label}>Your Personal Score (0-100)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 85.5"
          placeholderTextColor={COLORS.placeholder}
          value={score}
          onChangeText={setScore}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleAddOrUpdateRanking}
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
              (!selectedCity || !score.trim()) && styles.buttonDisabled,
            ]}
            onPress={handleAddOrUpdateRanking}
            disabled={
              !selectedCity || !score.trim() || isLoadingCities || isSubmitting
            }
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextPrimary}>Submit Ranking</Text>
          </TouchableOpacity>
        )}
        {error && isSubmitting && <Text style={styles.errorText}>{error}</Text>}
      </View>
    ),
    [
      selectedCity,
      score,
      isSubmitting,
      isLoadingCities,
      error,
      handleAddOrUpdateRanking,
    ]
  ); // Added handleAddOrUpdateRanking to dependencies

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
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust if header is present
      >
        <View style={styles.screenContainer}>
          <FlatList
            data={displayedCities}
            renderItem={renderCityPickerItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.cityList}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={
              // Show only if not loading cities and search term is present but no results
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

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
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Keyboard, // Import Keyboard
  TouchableWithoutFeedback, // To dismiss keyboard
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For a placeholder city icon

import { AuthContext } from "../../src/context/AuthContext";
import apiService from "../../src/api";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../src/theme";
import { styles } from "../../src/screens/tabs/addRanking.styles"; // Ensure this path is correct
import { RankingSlider } from "../../src/components/ranking/RankingSlider";

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
  const [score, setScore] = useState<number>(50);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false); // New state for search focus

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
    setFetchError("");
    try {
      const cityData = await apiService.getCities(0, 1000); // Fetch more for better client-side search
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
    }, 300); // Debounce search term

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredCities = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!trimmedSearch) {
      return []; // Only show results if there's a search term
    }
    return allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(trimmedSearch) ||
        city.country.toLowerCase().includes(trimmedSearch)
    );
  }, [allCities, debouncedSearchTerm]);

  const handleCitySelection = (city: City) => {
    setSelectedCity(city);
    setSearchTerm(city.name); // Optionally fill search bar with selected city name
    setIsSearchFocused(false); // Hide search results
    Keyboard.dismiss(); // Dismiss keyboard
    setScore(50); // Reset score for the new city
  };

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleAddOrUpdateRanking = async () => {
    if (!selectedCity) {
      setSubmitError("Please select a city to rank.");
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
      style={styles.cityPickerItem}
      onPress={() => handleCitySelection(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.cityPickerItemText}>
        {item.name}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  const cityInitialForSlider = useMemo(() => {
    return selectedCity ? selectedCity.name.charAt(0).toUpperCase() : undefined;
  }, [selectedCity]);

  // Show main loader only if cities haven't been fetched at all yet
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.screenContainer}>
            <View style={styles.searchContainer}>
              <Text style={styles.label}>Search for a City to Rank</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g., London, Paris, Tokyo..."
                placeholderTextColor={COLORS.placeholder}
                value={searchTerm}
                onChangeText={(text) => {
                  setSearchTerm(text);
                  if (!isSearchFocused && text.length > 0) {
                    setIsSearchFocused(true); // Show results when user starts typing
                  } else if (text.length === 0) {
                    setIsSearchFocused(false); // Hide results if search term is cleared
                    setSelectedCity(null); // Also clear selected city if search is cleared
                  }
                }}
                onFocus={() => setIsSearchFocused(true)}
                // onBlur={() => setIsSearchFocused(false)} // Be careful with onBlur, selection might trigger it
                autoCapitalize="words"
                returnKeyType="search"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            {isSearchFocused && searchTerm.trim().length > 0 && (
              <View style={styles.searchResultsContainer}>
                {isLoadingCities && allCities.length > 0 ? ( // Show small loader if filtering a large list
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={{ marginVertical: SPACING.md }}
                  />
                ) : filteredCities.length > 0 ? (
                  <FlatList
                    data={filteredCities}
                    renderItem={renderCityPickerItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.cityList} // Style for the list itself
                    keyboardShouldPersistTaps="handled"
                  />
                ) : (
                  <Text style={styles.emptyListText}>
                    {debouncedSearchTerm
                      ? `No cities match "${debouncedSearchTerm}".`
                      : "Keep typing..."}
                  </Text>
                )}
              </View>
            )}

            {/* Ranking Section - Only visible if a city is selected and search is not focused */}
            {!isSearchFocused && selectedCity && (
              <View style={styles.rankingSection}>
                <View style={styles.selectedCityDisplayContainer}>
                  {/* Placeholder for the draggable city symbol */}
                  <Ionicons
                    name="location-sharp"
                    size={48}
                    color={COLORS.primary}
                  />
                  <Text style={styles.selectedCityName}>
                    {selectedCity.name}, {selectedCity.country}
                  </Text>
                  <Text style={styles.selectedCityPrompt}>
                    Now, "throw" or drag this city onto the line below!
                  </Text>
                </View>

                <View style={styles.scoreAndSubmitContainer}>
                  <Text style={styles.label}>
                    Set Your Personal Score (0-100)
                  </Text>
                  <RankingSlider
                    initialScore={score}
                    onScoreChange={handleScoreChange}
                    cityInitial={cityInitialForSlider}
                    disabled={isSubmitting}
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
                      disabled={!selectedCity || isSubmitting}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.buttonTextPrimary}>
                        Submit Ranking
                      </Text>
                    </TouchableOpacity>
                  )}
                  {submitError && (
                    <Text style={styles.errorText}>{submitError}</Text>
                  )}
                </View>
              </View>
            )}

            {/* Prompt to search if no city is selected and search is not focused */}
            {!isSearchFocused && !selectedCity && !isLoadingCities && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.emptyListText}>
                  Search above to find a city and rank it.
                </Text>
                {fetchError && (
                  <Text style={styles.errorText}>{fetchError}</Text>
                )}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

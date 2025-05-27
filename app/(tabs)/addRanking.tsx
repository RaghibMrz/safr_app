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

import apiService, { UnauthorizedError } from "../../src/api";
import { AuthContext } from "../../src/context/AuthContext";
import { styles } from "../../src/screens/tabs/addRanking.styles"; // Ensure this path is correct
import { COLORS, SPACING } from "../../src/theme";

interface City {
  id: number;
  name: string;
  country: string;
}

interface RankingListHeaderProps {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  fetchError: string; // Renamed from 'error' for clarity
  isSubmitting: boolean;
}

const RankingListHeader: React.FC<RankingListHeaderProps> = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    fetchError, // Use fetchError here
    isSubmitting,
  }) => {
    return (
      <View style={styles.listHeaderContainer}>
        {fetchError && !isSubmitting && (
          <Text style={styles.errorText}>{fetchError}</Text>
        )}
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
        />
      </View>
    );
  }
);

interface RankingListFooterProps {
  selectedCity: City | null;
  score: string;
  setScore: (text: string) => void;
  isSubmitting: boolean;
  isLoadingCities: boolean;
  submitError: string; // Renamed from 'error' for clarity
  handleAddOrUpdateRanking: () => Promise<void>;
}

const RankingListFooter: React.FC<RankingListFooterProps> = React.memo(
  ({
    selectedCity,
    score,
    setScore,
    isSubmitting,
    isLoadingCities,
    submitError, // Use submitError here
    handleAddOrUpdateRanking,
  }) => {
    return (
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
        {submitError && <Text style={styles.errorText}>{submitError}</Text>}
      </View>
    );
  }
);

export default function AddRankingScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) { // This check should already be there, ensure it is.
    console.error("AuthContext is not available in AddRankingScreen.");
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <Text style={{ color: COLORS.error }}>Service unavailable.</Text>
        </View>
      </SafeAreaView>
    );
  }
  const { logout } = authContext; // Destructure logout

  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [score, setScore] = useState<string>("");
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");

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
      const cityData = await apiService.getCities(0, 15000);
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

  const handleAddOrUpdateRanking = async () => {
    if (!selectedCity) {
      setSubmitError("Please select a city from the search results to rank.");
      return;
    }
    if (!score.trim()) {
      setSubmitError("Please enter a score for the selected city.");
      return;
    }
    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      setSubmitError("Score must be a number between 0 and 100.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await apiService.addOrUpdateRanking(selectedCity.id, numericScore);
      Alert.alert(
        "Ranking Submitted!",
        `Your score for ${selectedCity.name} has been saved.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSearchTerm(""); // Reset search term
              setDebouncedSearchTerm(""); // Reset debounced search term
              setSelectedCity(null); // Reset selected city
              setScore(""); // Reset score input
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (e: any) {
      if (e instanceof UnauthorizedError) {
        setSubmitError("Session expired. Please log in again.");
        // Alert the user and then log out
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [{ text: "OK", onPress: logout }] // Call logout from AuthContext
        );
      } else {
        setSubmitError(
          e.message || "Failed to submit ranking. Please try again."
        );
      }
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
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.cityPickerItemText}>
        {item.name}, {item.country}
      </Text>
    </TouchableOpacity>
  );

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
                setScore={setScore}
                isSubmitting={isSubmitting}
                isLoadingCities={isLoadingCities}
                submitError={submitError}
                handleAddOrUpdateRanking={handleAddOrUpdateRanking}
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

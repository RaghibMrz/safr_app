// app/(tabs)/addRanking.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  PanResponder,
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
import { DraggableCity } from "../../src/components/ranking/DraggableCity";
import { SearchModal } from "../../src/components/ranking/SearchModal";
import { RankingLine } from "../../src/components/ranking/RankingLine";
import {
  CITY_COLORS,
  CITY_ICON_SIZE,
  FOCUS_INPUT_DELAY,
  LINE_Y_OFFSET,
  MAX_CITIES_FETCH,
  MAX_SEARCH_RESULTS,
  MODAL_ANIMATION_DURATION,
  RANKING_LINE_WIDTH,
  SEARCH_DEBOUNCE_DELAY,
} from "../../src/screens/tabs/addRanking.constants";
import { styles } from "../../src/screens/tabs/addRanking.styles";
import { COLORS, SPACING } from "../../src/theme";

const { height: screenHeight } = Dimensions.get("window");

// Layout constants for initial city positioning
const INITIAL_SPACING = SPACING.md;
const ICONS_PER_ROW = 5;

interface City {
  id: number;
  name: string;
  country: string;
}

interface DraggableCityData extends City {
  score: number;
  color: string;
  position: { x: number; y: number };
}

export default function AddRankingScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Refs
  const searchInputRef = useRef<TextInput>(null);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(screenHeight)).current;
  const cityPositions = useRef<{ [key: number]: Animated.ValueXY }>({});
  const colorIndex = useRef(0);
  const rankingLineRef = useRef<View>(null);

  // State
  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedCities, setSelectedCities] = useState<DraggableCityData[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentDraggingId, setCurrentDraggingId] = useState<number | null>(
    null
  );
  const [rankingLineLayout, setRankingLineLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Clear state when navigating away
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear all state when leaving the screen
        setSelectedCities([]);
        setSearchTerm("");
        setDebouncedSearchTerm("");
        Object.keys(cityPositions.current).forEach((key) => {
          delete cityPositions.current[parseInt(key)];
        });
        colorIndex.current = 0;
      };
    }, [])
  );

  // Fetch cities on mount
  const fetchCities = useCallback(async () => {
    setIsLoadingCities(true);
    setFetchError("");
    try {
      const cityData = await apiService.getCities(0, MAX_CITIES_FETCH);
      setAllCities(cityData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load cities";
      setFetchError(errorMessage);
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
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Modal animations
  useEffect(() => {
    if (showSearchModal) {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: MODAL_ANIMATION_DURATION.OPEN,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: MODAL_ANIMATION_DURATION.OPEN,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: MODAL_ANIMATION_DURATION.CLOSE,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: screenHeight,
          duration: MODAL_ANIMATION_DURATION.CLOSE,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSearchModal, modalOpacity, modalTranslateY]);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, FOCUS_INPUT_DELAY);

      return () => clearTimeout(timer);
    }
  }, [showSearchModal]);

  // Filter cities based on search
  const displayedCities = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!trimmedSearch) return [];

    return allCities
      .filter(
        (city) =>
          city.name.toLowerCase().includes(trimmedSearch) ||
          city.country.toLowerCase().includes(trimmedSearch)
      )
      .slice(0, MAX_SEARCH_RESULTS);
  }, [allCities, debouncedSearchTerm]);

  // Create pan responder for draggable cities
  const createPanResponder = useCallback(
    (cityId: number) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: () => {
          setCurrentDraggingId(cityId);
          const city = selectedCities.find((c) => c.id === cityId);
          if (city && cityPositions.current[cityId]) {
            cityPositions.current[cityId].setOffset({
              x: city.position.x,
              y: city.position.y,
            });
            cityPositions.current[cityId].setValue({ x: 0, y: 0 });
          }
        },

        onPanResponderMove: (_, gestureState) => {
          const position = cityPositions.current[cityId];
          if (position) {
            position.setValue({
              x: gestureState.dx,
              y: gestureState.dy,
            });
          }
        },

        onPanResponderRelease: (_, gestureState) => {
          const position = cityPositions.current[cityId];
          if (!position) return;

          position.flattenOffset();

          const absoluteY = gestureState.moveY;
          const lineTop = rankingLineLayout.y - CITY_ICON_SIZE / 2;
          const lineBottom =
            rankingLineLayout.y + rankingLineLayout.height + CITY_ICON_SIZE / 2;

          if (absoluteY >= lineTop && absoluteY <= lineBottom) {
            // Calculate score based on X position
            const currentX = (position.x as any)._value;
            const normalizedX = Math.max(
              0,
              Math.min(currentX, RANKING_LINE_WIDTH)
            );
            const score = Math.round((normalizedX / RANKING_LINE_WIDTH) * 100);

            // Snap to line Y position
            const snapY =
              rankingLineLayout.y +
              rankingLineLayout.height / 2 -
              CITY_ICON_SIZE / 2 -
              LINE_Y_OFFSET;

            // Update city data
            setSelectedCities((prev) =>
              prev.map((city) =>
                city.id === cityId
                  ? { ...city, score, position: { x: normalizedX, y: snapY } }
                  : city
              )
            );

            // Animate to position
            Animated.spring(position, {
              toValue: { x: normalizedX, y: snapY },
              useNativeDriver: false,
              friction: 5,
            }).start();
          } else {
            // Return to previous position
            const city = selectedCities.find((c) => c.id === cityId);
            const targetX = city?.position.x || 0;
            const targetY = city?.position.y || 0;

            Animated.spring(position, {
              toValue: { x: targetX, y: targetY },
              useNativeDriver: false,
            }).start();
          }

          setCurrentDraggingId(null);
        },
      });
    },
    [selectedCities, rankingLineLayout]
  );

  // Handle city selection
  const handleSelectCity = useCallback(
    (city: City) => {
      if (selectedCities.find((c) => c.id === city.id)) {
        Alert.alert(
          "Already Selected",
          `${city.name} is already in your ranking list.`
        );
        return;
      }

      // Calculate initial position based on current city count
      const index = selectedCities.length;
      const row = Math.floor(index / ICONS_PER_ROW);
      const col = index % ICONS_PER_ROW;
      const initialX = col * (CITY_ICON_SIZE + INITIAL_SPACING);
      const initialY = row * (CITY_ICON_SIZE + INITIAL_SPACING);

      cityPositions.current[city.id] = new Animated.ValueXY({
        x: initialX,
        y: initialY,
      });

      const newCity: DraggableCityData = {
        ...city,
        score: 0,
        color: CITY_COLORS[colorIndex.current % CITY_COLORS.length],
        position: { x: initialX, y: initialY },
      };

      colorIndex.current += 1;
      setSelectedCities((prev) => [...prev, newCity]);
      setShowSearchModal(false);
      setSearchTerm("");
      setDebouncedSearchTerm("");
    },
    [selectedCities]
  );

  // Handle city removal (no confirmation)
  const handleRemoveCity = useCallback((cityId: number) => {
    delete cityPositions.current[cityId];
    setSelectedCities((prev) => {
      const filtered = prev.filter((c) => c.id !== cityId);

      // Recalculate positions for remaining cities to fill gaps
      return filtered.map((city, index) => {
        const row = Math.floor(index / ICONS_PER_ROW);
        const col = index % ICONS_PER_ROW;
        const newX = col * (CITY_ICON_SIZE + INITIAL_SPACING);
        const newY = row * (CITY_ICON_SIZE + INITIAL_SPACING);

        // Only update position if city hasn't been placed on the ranking line
        if (city.score === 0) {
          cityPositions.current[city.id]?.setValue({ x: newX, y: newY });
          return { ...city, position: { x: newX, y: newY } };
        }
        return city;
      });
    });
  }, []);

  // Handle ranking submission
  const handleSubmitRankings = useCallback(async () => {
    const citiesWithScores = selectedCities.filter((city) => city.score > 0);

    if (citiesWithScores.length === 0) {
      Alert.alert(
        "No Rankings",
        "Please add and rank at least one city before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const results = await Promise.allSettled(
        citiesWithScores.map((city) =>
          apiService.addOrUpdateRanking(city.id, city.score)
        )
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failedCount = results.filter((r) => r.status === "rejected").length;

      if (failedCount > 0) {
        console.error(`Failed to submit ${failedCount} rankings`);
      }

      Alert.alert(
        "Rankings Submitted!",
        `Successfully saved ${successCount} out of ${citiesWithScores.length} rankings.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedCities([]);
              cityPositions.current = {};
              colorIndex.current = 0;
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit rankings";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCities, router]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowSearchModal(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  // Handle ranking line layout
  const handleRankingLineLayout = useCallback(() => {
    rankingLineRef.current?.measureInWindow((x, y, width, height) => {
      setRankingLineLayout({ x, y, width, height });
    });
  }, []);

  // Loading state
  if (!authContext) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <Text style={{ color: COLORS.error }}>Service unavailable.</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.screenContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rank Your Cities</Text>
            <Text style={styles.headerSubtitle}>
              Search for cities and drag them onto the line
            </Text>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowSearchModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchButtonText}>Search for a city...</Text>
          </TouchableOpacity>

          {/* Selected Cities */}
          <View style={styles.selectedCitiesContainer}>
            {selectedCities.length === 0 ? (
              <Text style={styles.emptyText}>
                No cities selected yet. Tap the search bar above to add cities.
              </Text>
            ) : (
              <View style={styles.cityIconsContainer}>
                {selectedCities.map((city) => {
                  const panResponder = createPanResponder(city.id);
                  const position = cityPositions.current[city.id];
                  const isDragging = currentDraggingId === city.id;

                  return (
                    <DraggableCity
                      key={city.id}
                      city={city}
                      position={position}
                      isDragging={isDragging}
                      panResponder={panResponder.panHandlers}
                      onRemove={handleRemoveCity}
                    />
                  );
                })}
              </View>
            )}
          </View>

          {/* Ranking Line */}
          <RankingLine
            ref={rankingLineRef}
            onLayout={handleRankingLineLayout}
          />

          {/* Submit Button */}
          {selectedCities.length > 0 && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleSubmitRankings}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Rankings</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Search Modal */}
      <SearchModal
        ref={searchInputRef}
        visible={showSearchModal}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onClose={handleModalClose}
        onSelectCity={handleSelectCity}
        displayedCities={displayedCities}
        isLoading={isLoadingCities}
        modalOpacity={modalOpacity}
        modalTranslateY={modalTranslateY}
      />
    </SafeAreaView>
  );
}

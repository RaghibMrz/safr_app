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
  CITY_ICON_SIZE, // Imported from constants
  FOCUS_INPUT_DELAY,
  IOS_ADJUST_WIDGET,
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
const ICONS_PER_ROW = 5; // Number of city icons to display per row in the unranked area
const MAX_UNRANKED_CITIES = 10; // New constant: Maximum number of unranked cities allowed at one time

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

  // Refs for managing animations and component instances
  const searchInputRef = useRef<TextInput>(null);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(screenHeight)).current;
  // Stores Animated.ValueXY for each city, allowing individual animation control
  const cityPositions = useRef<{ [key: number]: Animated.ValueXY }>({});
  const colorIndex = useRef(0); // Used to cycle through CITY_COLORS
  const rankingLineRef = useRef<View>(null); // Ref for the ranking line component

  // State variables
  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  // Stores the list of selected cities, including their score and current position
  const [selectedCities, setSelectedCities] = useState<DraggableCityData[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  // Tracks the ID of the city currently being dragged
  const [currentDraggingId, setCurrentDraggingId] = useState<number | null>(
    null
  );
  // Stores the layout measurements of the ranking line for positioning calculations
  const [rankingLineLayout, setRankingLineLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Hook to clear state when navigating away from the screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Reset all relevant state and refs to their initial values
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

  // Function to fetch cities from the API
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

  // Effect to fetch cities when the component mounts
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Effect to debounce the search term input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Effect to manage modal open/close animations (fade and slide)
  useEffect(() => {
    if (showSearchModal) {
      // Animate in: backdrop fades in, modal slides up
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: MODAL_ANIMATION_DURATION.OPEN,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 0, // Slide up to its natural position (0 offset from bottom:0)
          duration: MODAL_ANIMATION_DURATION.OPEN,
          easing: Easing.out(Easing.ease), // Smooth easing for slide in
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out: backdrop fades out, modal slides down
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: MODAL_ANIMATION_DURATION.CLOSE,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: screenHeight, // Slide down off-screen
          duration: MODAL_ANIMATION_DURATION.CLOSE,
          easing: Easing.in(Easing.ease), // Smooth easing for slide out
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSearchModal, modalOpacity, modalTranslateY]); // Dependencies for the effect

  // Effect to focus the search input when the modal opens
  useEffect(() => {
    if (showSearchModal) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, FOCUS_INPUT_DELAY); // Small delay to ensure modal is rendered

      return () => clearTimeout(timer);
    }
  }, [showSearchModal]);

  // Memoized list of cities to display in the search modal based on search term
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

  /**
   * Recalculates and animates the positions of all unranked cities
   * to fill any gaps created by ranked or removed cities.
   * @param currentCities The current array of DraggableCityData to re-layout.
   * @returns The updated array of DraggableCityData with new positions.
   */
  const recalculateUnrankedPositions = useCallback(
    (currentCities: DraggableCityData[]) => {
      // Filter only the unranked cities to re-position them in the grid
      const unrankedCities = currentCities.filter((c) => c.score === 0);
      let newSelectedCities = [...currentCities]; // Create a mutable copy to update positions

      unrankedCities.forEach((city, index) => {
        // Calculate new grid position for each unranked city
        const row = Math.floor(index / ICONS_PER_ROW);
        const col = index % ICONS_PER_ROW;
        const newX = col * (CITY_ICON_SIZE + INITIAL_SPACING);
        const newY = row * (CITY_ICON_SIZE + INITIAL_SPACING);

        // Find the city in the full list to update its position in the state
        const cityIndexInFullList = newSelectedCities.findIndex(
          (c) => c.id === city.id
        );
        if (cityIndexInFullList !== -1) {
          newSelectedCities[cityIndexInFullList] = {
            ...newSelectedCities[cityIndexInFullList],
            position: { x: newX, y: newY }, // Update the position in the state
          };
          // Animate the city to its new position if its Animated.ValueXY exists
          if (cityPositions.current[city.id]) {
            Animated.spring(cityPositions.current[city.id], {
              toValue: { x: newX, y: newY },
              useNativeDriver: false,
              friction: 7, // Smooth animation for rearrangement
            }).start();
          }
        }
      });
      return newSelectedCities; // Return the list with updated positions
    },
    []
  ); // No dependencies as it uses constants and refs directly

  // Creates a PanResponder for each draggable city
  const createPanResponder = useCallback(
    (cityId: number) => {
      return PanResponder.create({
        // Allow the PanResponder to claim the touch
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        // When dragging starts
        onPanResponderGrant: () => {
          setCurrentDraggingId(cityId); // Set the current dragging city
          const city = selectedCities.find((c) => c.id === cityId);
          if (city && cityPositions.current[cityId]) {
            // Set the offset to the current position to prevent jumps
            cityPositions.current[cityId].setOffset({
              x: city.position.x,
              y: city.position.y,
            });
            cityPositions.current[cityId].setValue({ x: 0, y: 0 }); // Reset value to 0 for relative movement
          }
        },

        // When dragging moves
        onPanResponderMove: (_, gestureState) => {
          const position = cityPositions.current[cityId];
          if (position) {
            position.setValue({
              x: gestureState.dx, // Update position based on drag delta X
              y: gestureState.dy, // Update position based on drag delta Y
            });
          }
        },

        // When dragging ends
        onPanResponderRelease: (_, gestureState) => {
          const position = cityPositions.current[cityId];
          if (!position) return;

          position.flattenOffset(); // Apply the offset to the value

          const absoluteY = gestureState.moveY; // Get absolute Y position of release
          // Define the vertical bounds of the ranking line
          const lineTop = rankingLineLayout.y - CITY_ICON_SIZE / 2;
          const lineBottom =
            rankingLineLayout.y + rankingLineLayout.height + CITY_ICON_SIZE / 2;

          // Check if the city was released near the ranking line
          if (absoluteY >= lineTop && absoluteY <= lineBottom) {
            // Calculate score based on X position relative to the ranking line
            const currentX = (position.x as any)._value;
            const normalizedX = Math.max(
              0,
              Math.min(currentX, RANKING_LINE_WIDTH)
            );
            const score = Math.round((normalizedX / RANKING_LINE_WIDTH) * 100);

            // Calculate the Y position to snap the city onto the center of the line
            const snapY =
              rankingLineLayout.y +
              rankingLineLayout.height / 2 -
              CITY_ICON_SIZE / 2 -
              LINE_Y_OFFSET -
              IOS_ADJUST_WIDGET;
            // Update city data in state
            setSelectedCities((prev) => {
              let updatedCities = prev.map((city) =>
                city.id === cityId
                  ? { ...city, score, position: { x: normalizedX, y: snapY } }
                  : city
              );

              // After updating the dragged city's score,
              // recalculate positions for all unranked cities to fill gaps
              updatedCities = recalculateUnrankedPositions(updatedCities);

              return updatedCities;
            });

            // Animate the dragged city to its final snapped position
            Animated.spring(position, {
              toValue: { x: normalizedX, y: snapY },
              useNativeDriver: false,
              friction: 5, // Smooth snap animation
            }).start();
          } else {
            // If not released on the line, return to its last known position
            const city = selectedCities.find((c) => c.id === cityId);
            const targetX = city?.position.x || 0;
            const targetY = city?.position.y || 0;

            Animated.spring(position, {
              toValue: { x: targetX, y: targetY },
              useNativeDriver: false,
            }).start();
          }

          setCurrentDraggingId(null); // Reset dragging state
        },
      });
    },
    [selectedCities, rankingLineLayout, recalculateUnrankedPositions] // Add recalculateUnrankedPositions as a dependency
  );

  // Handles selecting a city from the search results
  const handleSelectCity = useCallback(
    (city: City) => {
      if (selectedCities.find((c) => c.id === city.id)) {
        Alert.alert(
          "Already Selected",
          `${city.name} is already in your ranking list.`
        );
        return;
      }

      // Filter only currently unranked cities to check against the limit
      const unrankedCities = selectedCities.filter((c) => c.score === 0);

      // Check if the limit of unranked cities has been reached
      if (unrankedCities.length >= MAX_UNRANKED_CITIES) {
        Alert.alert(
          "Limit Reached",
          `You can only have up to ${MAX_UNRANKED_CITIES} unranked cities at a time. Please rank or remove existing cities.`
        );
        setShowSearchModal(false); // Close modal
        setSearchTerm(""); // Clear search term
        setDebouncedSearchTerm("");
        return; // Prevent adding the new city
      }

      // Calculate initial position based on the current number of unranked cities
      const index = unrankedCities.length; // New city will be at this index among unranked
      const row = Math.floor(index / ICONS_PER_ROW);
      const col = index % ICONS_PER_ROW;
      const initialX = col * (CITY_ICON_SIZE + INITIAL_SPACING);
      const initialY = row * (CITY_ICON_SIZE + INITIAL_SPACING);

      // Initialize Animated.ValueXY for the new city
      cityPositions.current[city.id] = new Animated.ValueXY({
        x: initialX,
        y: initialY,
      });

      const newCity: DraggableCityData = {
        ...city,
        score: 0, // Initially unranked
        color: CITY_COLORS[colorIndex.current % CITY_COLORS.length],
        position: { x: initialX, y: initialY }, // Store initial position for snap-back
      };

      colorIndex.current += 1; // Cycle through colors
      setSelectedCities((prev) => [...prev, newCity]); // Add new city to state
      setShowSearchModal(false); // Close modal
      setSearchTerm(""); // Clear search term
      setDebouncedSearchTerm("");
    },
    [selectedCities] // Dependency: selectedCities to get accurate length for initial position
  );

  // Handles removing a city from the selected list
  const handleRemoveCity = useCallback(
    (cityId: number) => {
      // No confirmation alert as per previous instruction
      delete cityPositions.current[cityId]; // Remove Animated.ValueXY for the removed city
      setSelectedCities((prev) => {
        const filtered = prev.filter((c) => c.id !== cityId);

        // Recalculate positions for remaining unranked cities after removal
        const updatedCities = recalculateUnrankedPositions(filtered);

        return updatedCities;
      });
    },
    [recalculateUnrankedPositions]
  ); // Dependency: recalculateUnrankedPositions

  // Handles submission of rankings to the API
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
              // Clear all state after successful submission
              setSelectedCities([]);
              cityPositions.current = {};
              colorIndex.current = 0;
              router.replace("/(tabs)/home"); // Navigate to home screen
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
  }, [selectedCities, router]); // Dependencies for the callback

  // Handles closing the search modal
  const handleModalClose = useCallback(() => {
    setShowSearchModal(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  // Handles layout measurement of the ranking line
  const handleRankingLineLayout = useCallback(() => {
    rankingLineRef.current?.measureInWindow((x, y, width, height) => {
      setRankingLineLayout({ x, y, width, height });
    });
  }, []);

  // Render loading state if auth context is not available
  if (!authContext) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <Text style={{ color: COLORS.error }}>Service unavailable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render loading state while fetching cities
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

          {/* Selected Cities Display Area */}
          <View style={styles.selectedCitiesContainer}>
            {selectedCities.length === 0 ? (
              <Text style={styles.emptyText}>
                No cities selected yet. Tap the search bar above to add cities.
              </Text>
            ) : (
              // This View is the flex container for the DraggableCity components
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

          {/* Ranking Line Component */}
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

      {/* Search Modal Component */}
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

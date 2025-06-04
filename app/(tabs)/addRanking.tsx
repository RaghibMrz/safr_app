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
  PanResponder,
  SafeAreaView,
  ScrollView,
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
  ICONS_PER_ROW,
  INITIAL_SPACING,
  IOS_ADJUST_WIDGET,
  LINE_Y_OFFSET,
  MAX_CITIES_FETCH,
  MAX_SEARCH_RESULTS,
  MAX_UNRANKED_CITIES,
  MODAL_ANIMATION_DURATION,
  RANKING_LINE_WIDTH,
  SEARCH_DEBOUNCE_DELAY,
} from "../../src/screens/tabs/addRanking.constants";
import { styles } from "../../src/screens/tabs/addRanking.styles";
import { COLORS, FONT_SIZES, SPACING } from "../../src/theme";
import { City } from "@/src/types/city";
import { DraggableCityData } from "@/src/types/ranking";

const { height: screenHeight } = Dimensions.get("window");

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

  // Animation refs
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const instructionOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.95)).current;

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

  // Animate on focus
  useFocusEffect(
    useCallback(() => {
      // Animate in
      Animated.parallel([
        Animated.timing(instructionOpacity, {
          toValue: 1,
          duration: 600,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        // Reset when leaving
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  useEffect(() => {
    if (showSearchModal) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, FOCUS_INPUT_DELAY);

      return () => clearTimeout(timer);
    }
  }, [showSearchModal]);

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

  const recalculateUnrankedPositions = useCallback(
    (currentCities: DraggableCityData[]) => {
      let newSelectedCities = [...currentCities];
      let unrankedCount = 0;

      newSelectedCities.forEach((city, index) => {
        if (city.score === 0) {
          const row = Math.floor(unrankedCount / ICONS_PER_ROW);
          const col = unrankedCount % ICONS_PER_ROW;
          const newX = col * (CITY_ICON_SIZE + INITIAL_SPACING);
          const newY = row * (CITY_ICON_SIZE + INITIAL_SPACING);

          newSelectedCities[index] = {
            ...city,
            position: { x: newX, y: newY },
          };

          if (cityPositions.current[city.id]) {
            Animated.spring(cityPositions.current[city.id], {
              toValue: { x: newX, y: newY },
              useNativeDriver: false,
              friction: 7,
            }).start();
          }
          unrankedCount++;
        }
      });
      return newSelectedCities;
    },
    []
  );

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
          const SNAP_PADDING = CITY_ICON_SIZE * 0.7;
          const lineTop = rankingLineLayout.y - SNAP_PADDING;
          const lineBottom =
            rankingLineLayout.y + rankingLineLayout.height + SNAP_PADDING;

          if (absoluteY >= lineTop && absoluteY <= lineBottom) {
            const currentX = (position.x as any)._value;
            const normalizedX = Math.max(
              0,
              Math.min(currentX, RANKING_LINE_WIDTH)
            );
            const score = Math.round((normalizedX / RANKING_LINE_WIDTH) * 100);

            const snapY =
              rankingLineLayout.y +
              rankingLineLayout.height / 2 -
              CITY_ICON_SIZE / 2 -
              LINE_Y_OFFSET -
              IOS_ADJUST_WIDGET;

            setSelectedCities((prev) => {
              let updatedCities = prev.map((city) =>
                city.id === cityId
                  ? { ...city, score, position: { x: normalizedX, y: snapY } }
                  : city
              );

              updatedCities = recalculateUnrankedPositions(updatedCities);
              return updatedCities;
            });

            Animated.spring(position, {
              toValue: { x: normalizedX, y: snapY },
              useNativeDriver: false,
              friction: 5,
            }).start();
          } else {
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
    [selectedCities, rankingLineLayout, recalculateUnrankedPositions]
  );

  const resetSearchModalState = useCallback(() => {
    setShowSearchModal(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  const handleSelectCity = useCallback(
    (city: City) => {
      if (selectedCities.find((c) => c.id === city.id)) {
        Alert.alert(
          "Already Selected",
          `${city.name} is already in your ranking list.`
        );
        resetSearchModalState();
        return;
      }

      const unrankedCities = selectedCities.filter((c) => c.score === 0);

      if (unrankedCities.length >= MAX_UNRANKED_CITIES) {
        Alert.alert(
          "Limit Reached",
          `You can only have up to ${MAX_UNRANKED_CITIES} unranked cities at a time. Please rank or remove existing cities.`
        );
        resetSearchModalState();
        return;
      }

      const index = unrankedCities.length;
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
      resetSearchModalState();
    },
    [selectedCities, resetSearchModalState]
  );

  const handleRemoveCity = useCallback(
    (cityId: number) => {
      delete cityPositions.current[cityId];
      setSelectedCities((prev) => {
        const filtered = prev.filter((c) => c.id !== cityId);
        const updatedCities = recalculateUnrankedPositions(filtered);
        return updatedCities;
      });
    },
    [recalculateUnrankedPositions]
  );

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

  const handleModalClose = useCallback(() => {
    resetSearchModalState();
  }, [resetSearchModalState]);

  const handleRankingLineLayout = useCallback(() => {
    rankingLineRef.current?.measureInWindow((x, y, width, height) => {
      setRankingLineLayout({ x, y, width, height });
    });
  }, []);

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

  // Calculate stats
  const rankedCount = selectedCities.filter((c) => c.score > 0).length;
  const unrankedCount = selectedCities.filter((c) => c.score === 0).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <View
          style={[styles.modernHeader, { backgroundColor: COLORS.primary }]}
        >
          <Animated.View style={{ opacity: headerOpacity }}>
            <Text style={styles.modernHeaderTitle}>Rank Your Cities</Text>
          </Animated.View>
        </View>

        <View style={styles.contentContainer}>
          {/* Instructions/Stats Row */}
          <View style={styles.containerWithFixedContentHeight}>
            {rankedCount > 0 ? (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{rankedCount}</Text>
                  <Text style={styles.statLabel}>Ranked</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{unrankedCount}</Text>
                  <Text style={styles.statLabel}>Unranked</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{selectedCities.length}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.instructionsCard,
                  { opacity: instructionOpacity },
                ]}
              >
                <Ionicons
                  name="information-circle"
                  size={FONT_SIZES.xxl}
                  color={COLORS.primary}
                />
                <Text style={styles.instructionsText}>
                  Tap the search bar above to add cities, then drag them onto
                  the ranking line below to rate them!
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Search Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.modernSearchButton}
              onPress={() => setShowSearchModal(true)}
              activeOpacity={0.9}
            >
              <View style={styles.searchButtonContent}>
                <Ionicons
                  name="search"
                  size={FONT_SIZES.xlg}
                  color={COLORS.primary}
                />
                <Text style={styles.searchButtonText}>
                  Search for cities...
                </Text>
                <View style={styles.searchButtonBadge}>
                  <Text style={styles.searchButtonBadgeText}>
                    {MAX_UNRANKED_CITIES - unrankedCount} left
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Selected Cities */}
          <View style={styles.selectedCitiesContainer}>
            {selectedCities.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons
                  name="location-outline"
                  size={FONT_SIZES.h1}
                  color={COLORS.textMuted}
                />
                <Text style={styles.emptyStateText}>No cities added yet</Text>
              </View>
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
          <View>
            <Text style={styles.rankingSectionTitle}>
              Drag Cities Here to Rate
            </Text>
            <RankingLine
              ref={rankingLineRef}
              onLayout={handleRankingLineLayout}
            />
          </View>

          {/* Submit Button */}
          {selectedCities.length > 0 && (
            <TouchableOpacity
              style={[
                styles.modernSubmitButton,
                isSubmitting && styles.buttonDisabled,
                {
                  backgroundColor:
                    rankedCount > 0 ? COLORS.primary : COLORS.disabled,
                },
              ]}
              onPress={handleSubmitRankings}
              disabled={isSubmitting || rankedCount === 0}
              activeOpacity={0.9}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={FONT_SIZES.xxl}
                    color={COLORS.white}
                  />
                  <Text style={styles.modernSubmitButtonText}>
                    Submit {rankedCount} Ranking{rankedCount !== 1 ? "s" : ""}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

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

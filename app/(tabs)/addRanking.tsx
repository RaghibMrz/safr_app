// app/(tabs)/addRanking.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
import { styles } from "../../src/screens/tabs/addRanking.styles";
import { COLORS, SPACING } from "../../src/theme";

const { width: screenWidth } = Dimensions.get("window");
const RANKING_LINE_WIDTH = screenWidth - SPACING.xl * 2 - 60; // Account for labels
const RANKING_LINE_HEIGHT = 60;
const CITY_ICON_SIZE = 60;

interface City {
  id: number;
  name: string;
  country: string;
}

interface DraggableCity extends City {
  score: number;
  color: string;
  position: { x: number; y: number };
}

const CITY_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
  "#54A0FF",
  "#48DBFB",
  "#1DD1A1",
  "#FFA502",
];

export default function AddRankingScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedCities, setSelectedCities] = useState<DraggableCity[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentDraggingId, setCurrentDraggingId] = useState<number | null>(
    null
  );

  // Animation values for each city
  const cityPositions = useRef<{ [key: number]: Animated.ValueXY }>({});
  const colorIndex = useRef(0);
  const rankingLineRef = useRef<View>(null);
  const [rankingLineLayout, setRankingLineLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

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
    return allCities
      .filter(
        (city) =>
          city.name.toLowerCase().includes(trimmedSearch) ||
          city.country.toLowerCase().includes(trimmedSearch)
      )
      .slice(0, 50);
  }, [allCities, debouncedSearchTerm]);

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

          // Get absolute position
          const absoluteY = gestureState.moveY;

          // Check if Y position is near the ranking line
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
              100; // Adjust for city spawn area

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

  const handleSelectCity = useCallback(
    (city: City) => {
      if (selectedCities.find((c) => c.id === city.id)) {
        Alert.alert(
          "Already Selected",
          `${city.name} is already in your ranking list.`
        );
        return;
      }

      cityPositions.current[city.id] = new Animated.ValueXY({ x: 0, y: 0 });

      const newCity: DraggableCity = {
        ...city,
        score: 0,
        color: CITY_COLORS[colorIndex.current % CITY_COLORS.length],
        position: { x: 0, y: 0 },
      };

      colorIndex.current += 1;
      setSelectedCities((prev) => [...prev, newCity]);
      setShowSearchModal(false);
      setSearchTerm("");
      setDebouncedSearchTerm("");
    },
    [selectedCities]
  );

  const handleRemoveCity = useCallback((cityId: number) => {
    Alert.alert(
      "Remove City",
      "Are you sure you want to remove this city from your ranking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            delete cityPositions.current[cityId];
            setSelectedCities((prev) => prev.filter((c) => c.id !== cityId));
          },
        },
      ]
    );
  }, []);

  const handleSubmitRankings = async () => {
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
      await Promise.all(
        citiesWithScores.map((city) =>
          apiService.addOrUpdateRanking(city.id, city.score)
        )
      );

      Alert.alert(
        "Rankings Submitted!",
        `Successfully saved rankings for ${citiesWithScores.length} cities.`,
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (e: any) {
      Alert.alert(
        "Error",
        e.message || "Failed to submit rankings. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSearchResult = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleSelectCity(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.searchResultText}>
        {item.name}, {item.country}
      </Text>
      <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
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
      >
        <View style={styles.screenContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rank Your Cities</Text>
            <Text style={styles.headerSubtitle}>
              Search for cities and drag them onto the ranking line
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
                    <Animated.View
                      key={city.id}
                      style={[
                        styles.cityIcon,
                        {
                          backgroundColor: city.color,
                          transform: position
                            ? [
                                { translateX: position.x },
                                { translateY: position.y },
                              ]
                            : [],
                          zIndex: isDragging ? 1000 : city.score > 0 ? 10 : 1,
                          opacity: isDragging ? 0.8 : 1,
                          elevation: isDragging ? 10 : 5,
                        },
                      ]}
                      {...panResponder.panHandlers}
                    >
                      <Text style={styles.cityIconText} numberOfLines={1}>
                        {city.name.substring(0, 3).toUpperCase()}
                      </Text>
                      {city.score > 0 && (
                        <Text style={styles.cityScoreText}>{city.score}</Text>
                      )}
                      <TouchableOpacity
                        style={styles.removeCityButton}
                        onPress={() => handleRemoveCity(city.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Ranking Line */}
          <View style={styles.rankingContainer}>
            <Text style={styles.rankingLabelLeft}>0</Text>
            <View
              ref={rankingLineRef}
              style={styles.rankingLineWrapper}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                // Measure relative to the window
                rankingLineRef.current?.measureInWindow(
                  (x, y, width, height) => {
                    setRankingLineLayout({ x, y, width, height });
                  }
                );
              }}
            >
              <View style={styles.rankingLine} />
              {/* Score markers */}
              {[0, 25, 50, 75, 100].map((value) => (
                <View
                  key={value}
                  style={[styles.scoreMarker, { left: `${value}%` }]}
                >
                  <View style={styles.markerLine} />
                  <Text style={styles.markerText}>{value}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.rankingLabelRight}>100</Text>
          </View>

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
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setShowSearchModal(false);
              setSearchTerm("");
              setDebouncedSearchTerm("");
            }}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Cities</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSearchModal(false);
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearchInput}
              placeholder="Type city name..."
              placeholderTextColor={COLORS.placeholder}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoFocus
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
                searchTerm.trim() && !isLoadingCities ? (
                  <Text style={styles.noResultsText}>
                    No cities found matching "{searchTerm}"
                  </Text>
                ) : null
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

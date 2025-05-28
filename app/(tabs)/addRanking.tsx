// app/(tabs)/addRanking.tsx
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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
  Keyboard,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
// Removed Ionicons as it's not directly used here for placeholders anymore

import { AuthContext } from "../../src/context/AuthContext";
import apiService from "../../src/api";
import { COLORS, TYPOGRAPHY, SPACING, FONT_WEIGHTS } from "../../src/theme";
import { styles } from "../../src/screens/tabs/addRanking.styles";
import { RankingSlider } from "../../src/components/ranking/RankingSlider";
import { DraggableCitySymbol } from "../../src/components/ranking/DraggableCitySymbol";

interface City {
  id: number;
  name: string;
  country: string;
}
interface LayoutData {
  x: number;
  y: number;
  width: number;
  height: number;
  isMeasured: boolean;
}

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  fetchError: string;
  isInteractionDisabled: boolean;
  onFocus: () => void;
  onBlur?: () => void;
}
const SearchHeader: React.FC<SearchHeaderProps> = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    fetchError,
    isInteractionDisabled,
    onFocus,
    onBlur,
  }) => (
    <View style={styles.searchContainerFromStyles}>
      {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}
      <Text style={styles.label}>1. Search & Select City</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Type city name..."
        placeholderTextColor={COLORS.placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCapitalize="words"
        returnKeyType="search"
        autoCorrect={false}
        spellCheck={false}
        editable={!isInteractionDisabled}
      />
    </View>
  )
);

export default function AddRankingScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // All state and ref declarations at the top
  const [allCities, setAllCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [score, setScore] = useState<number>(50);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [draggableSymbolTargetXY, setDraggableSymbolTargetXY] = useState({
    x: -1000,
    y: -1000,
  }); // Correctly named state
  const [showDraggableSymbol, setShowDraggableSymbol] = useState(false);
  const [rankingLineLayout, setRankingLineLayout] = useState<LayoutData | null>(
    null
  );
  const [holdingAreaLayout, setHoldingAreaLayout] = useState<LayoutData | null>(
    null
  );
  const draggableSymbolHoldingAreaRef = useRef<View>(null);
  const rankingLineViewRef = useRef<View>(null);
  const [isRankingLineActiveForHalo, setIsRankingLineActiveForHalo] =
    useState(false);
  const [isSymbolCurrentlyDragging, setIsSymbolCurrentlyDragging] =
    useState(false);

  if (!authContext) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <Text style={{ color: COLORS.error }}>
            Service Unavailable. AuthContext is missing.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const fetchCities = useCallback(async () => {
    setIsLoadingCities(true);
    setFetchError("");
    try {
      const cityData = await apiService.getCities(0, 1000);
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
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredCities = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!trimmedSearch) return [];
    return allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(trimmedSearch) ||
        city.country.toLowerCase().includes(trimmedSearch)
    );
  }, [allCities, debouncedSearchTerm]);

  const updateDraggableSymbolTargetPosition = useCallback(() => {
    if (holdingAreaLayout) {
      const symbolSize = styles.symbol?.width || 60;
      const targetX =
        holdingAreaLayout.x + holdingAreaLayout.width / 2 - symbolSize / 2;
      const targetY =
        holdingAreaLayout.y + holdingAreaLayout.height / 2 - symbolSize / 2;
      setDraggableSymbolTargetXY({ x: targetX, y: targetY }); // Use correct state setter
    } else {
      const { width: screenWidth } = Dimensions.get("window");
      setDraggableSymbolTargetXY({
        x: screenWidth / 2 - (styles.symbol?.width || 60) / 2,
        y: 250,
      }); // Use correct state setter
    }
  }, [holdingAreaLayout]);

  useEffect(() => {
    if (holdingAreaLayout) {
      updateDraggableSymbolTargetPosition();
    }
  }, [holdingAreaLayout, updateDraggableSymbolTargetPosition]);

  useEffect(() => {
    if (selectedCity && showDraggableSymbol) {
      updateDraggableSymbolTargetPosition();
    } else if (!selectedCity || !showDraggableSymbol) {
      setDraggableSymbolTargetXY({ x: -1000, y: -1000 }); // Use correct state setter
    }
  }, [selectedCity, showDraggableSymbol, updateDraggableSymbolTargetPosition]);

  const handleCitySelection = (city: City) => {
    setSelectedCity(city);
    setIsSearchFocused(false);
    Keyboard.dismiss();
    setScore(50);
    setShowDraggableSymbol(true);
    setIsRankingLineActiveForHalo(false);
  };

  const handleScoreChangeFromSlider = useCallback(
    (newScore: number) => {
      setScore(newScore);
      if (showDraggableSymbol) {
        setShowDraggableSymbol(false);
      }
    },
    [showDraggableSymbol]
  );

  const handleDragSymbolStart = useCallback(() => {
    setIsSymbolCurrentlyDragging(true);
    setSubmitError("");
  }, []);

  const handleDragSymbolUpdate = useCallback(
    (currentSymbolScreenX: number, currentSymbolScreenY: number) => {
      if (!rankingLineLayout || !selectedCity || !showDraggableSymbol) {
        setIsRankingLineActiveForHalo(false);
        return;
      }
      const symbolSize = styles.symbol?.width || 60;
      const symbolCenterX = currentSymbolScreenX + symbolSize / 2;
      const symbolCenterY = currentSymbolScreenY + symbolSize / 2;

      const lineYCenter = rankingLineLayout.y + rankingLineLayout.height / 2;
      const lineXStart = rankingLineLayout.x;
      const lineXEnd = rankingLineLayout.x + rankingLineLayout.width;

      const yLeewayForHalo = rankingLineLayout.height * 2.0;
      const isOverYForHalo =
        Math.abs(symbolCenterY - lineYCenter) <= yLeewayForHalo;
      const isOverXForHalo =
        symbolCenterX >= lineXStart && symbolCenterX <= lineXEnd;

      setIsRankingLineActiveForHalo(isOverXForHalo && isOverYForHalo);
    },
    [rankingLineLayout, selectedCity, showDraggableSymbol]
  );

  const handleDragSymbolEnd = (
    finalSymbolScreenX: number,
    finalSymbolScreenY: number
  ) => {
    setIsSymbolCurrentlyDragging(false);
    setIsRankingLineActiveForHalo(false);
    let droppedOnLine = false;

    if (rankingLineLayout && selectedCity) {
      const symbolSize = styles.symbol?.width || 60;
      const dropCenterX = finalSymbolScreenX + symbolSize / 2;
      const dropCenterY = finalSymbolScreenY + symbolSize / 2;

      const lineYCenter = rankingLineLayout.y + rankingLineLayout.height / 2;
      const lineXStart = rankingLineLayout.x;
      const lineXEnd = rankingLineLayout.x + rankingLineLayout.width;

      const yLeewayForDrop = rankingLineLayout.height * 0.6;
      const isOverX = dropCenterX >= lineXStart && dropCenterX <= lineXEnd;
      const isOverYPrecise =
        Math.abs(dropCenterY - lineYCenter) <= yLeewayForDrop;

      if (isOverX && isOverYPrecise) {
        let newScore =
          ((dropCenterX - lineXStart) / rankingLineLayout.width) * 100;
        newScore = Math.max(0, Math.min(Math.round(newScore), 100));

        setScore(newScore);
        setShowDraggableSymbol(false);
        Alert.alert(
          "Score Set!",
          `Score for ${selectedCity.name} set to ${newScore.toFixed(
            0
          )}. Fine-tune or submit.`
        );
        droppedOnLine = true;
      }
    }

    if (!droppedOnLine) {
      updateDraggableSymbolTargetPosition();
      if (!selectedCity) {
        setShowDraggableSymbol(false);
      } else {
        setShowDraggableSymbol(true);
      }
    }
  };

  const handleAddOrUpdateRanking = async () => {
    if (!selectedCity) {
      setSubmitError("Please select and rank a city.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await apiService.addOrUpdateRanking(selectedCity.id, score);
      Alert.alert(
        "Ranking Submitted!",
        `Your ranking for ${selectedCity.name} (${score.toFixed(
          0
        )}) has been saved.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSearchTerm("");
              setDebouncedSearchTerm("");
              setSelectedCity(null);
              setScore(50);
              setShowDraggableSymbol(false);
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (e: any) {
      setSubmitError(e.message || "Failed to submit.");
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

  const onHoldingAreaLayout = useCallback(
    (event: LayoutChangeEvent) => {
      draggableSymbolHoldingAreaRef.current?.measureInWindow(
        (screenX, screenY, width, height) => {
          if (width > 0 && height > 0) {
            const newLayout = {
              x: screenX,
              y: screenY,
              width: width,
              height: height,
              isMeasured: true,
            };
            if (
              !holdingAreaLayout ||
              JSON.stringify(holdingAreaLayout) !== JSON.stringify(newLayout)
            ) {
              setHoldingAreaLayout(newLayout);
            }
          }
        }
      );
    },
    [holdingAreaLayout]
  );

  const onRankingLineViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      rankingLineViewRef.current?.measureInWindow((x, y, width, height) => {
        if (
          width > 0 &&
          height > 0 &&
          (!rankingLineLayout ||
            rankingLineLayout.x !== x ||
            rankingLineLayout.y !== y ||
            rankingLineLayout.width !== width ||
            rankingLineLayout.height !== height)
        ) {
          setRankingLineLayout({
            x,
            y,
            width: width,
            height: height,
            isMeasured: true,
          });
        }
      });
    },
    [rankingLineLayout]
  );

  if (isLoadingCities && allCities.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredLoaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading cities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const showRankingSectionAndSlider = selectedCity && !isSearchFocused;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setIsSearchFocused(false);
            }}
            accessible={false}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.screenContainer}>
                <SearchHeader
                  searchTerm={searchTerm}
                  setSearchTerm={(text) => {
                    setSearchTerm(text);
                    if (text.length > 0) {
                      if (!isSearchFocused) setIsSearchFocused(true);
                      if (selectedCity || showDraggableSymbol) {
                        setSelectedCity(null);
                        setShowDraggableSymbol(false);
                        setScore(50);
                        setIsRankingLineActiveForHalo(false);
                      }
                    } else {
                      setIsSearchFocused(false);
                    }
                  }}
                  fetchError={fetchError}
                  isInteractionDisabled={
                    isSubmitting || isSymbolCurrentlyDragging
                  }
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (showDraggableSymbol || selectedCity) {
                      setShowDraggableSymbol(false);
                      setSelectedCity(null);
                      setScore(50);
                      setIsRankingLineActiveForHalo(false);
                    }
                  }}
                  onBlur={() => {
                    if (!searchTerm.trim()) {
                      setIsSearchFocused(false);
                    }
                  }}
                />

                {isSearchFocused && searchTerm.trim().length > 0 && (
                  <View style={styles.searchResultsContainer}>
                    {isLoadingCities && allCities.length === 0 ? (
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
                        style={styles.cityList}
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

                <View
                  ref={draggableSymbolHoldingAreaRef}
                  style={styles.draggableSymbolHoldingArea}
                  onLayout={onHoldingAreaLayout}
                >
                  {showRankingSectionAndSlider && selectedCity && (
                    <View style={styles.selectedCityInfoContainer}>
                      <Text style={styles.selectedCityName}>
                        {selectedCity.name}
                      </Text>
                      {showDraggableSymbol ? (
                        <Text style={styles.selectedCityPrompt}>
                          Drag the symbol onto the line below to rank!
                        </Text>
                      ) : (
                        <Text style={styles.selectedCityPrompt}>
                          Score: {score.toFixed(0)}. Fine-tune or submit.
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                {/* Use draggableSymbolTargetXY for props */}
                {selectedCity && draggableSymbolTargetXY.x > -999 && (
                  <DraggableCitySymbol
                    key={selectedCity.id.toString()}
                    city={selectedCity}
                    targetScreenX={draggableSymbolTargetXY.x}
                    targetScreenY={draggableSymbolTargetXY.y}
                    onDragStart={handleDragSymbolStart}
                    onDragActiveUpdate={handleDragSymbolUpdate}
                    onDragEnd={handleDragSymbolEnd}
                    isVisible={showDraggableSymbol}
                  />
                )}

                {showRankingSectionAndSlider && (
                  <View style={styles.rankingSection}>
                    <View
                      ref={rankingLineViewRef}
                      onLayout={onRankingLineViewLayout}
                    >
                      <RankingSlider
                        currentScore={score}
                        onScoreChange={handleScoreChangeFromSlider}
                        disabled={
                          isSubmitting ||
                          showDraggableSymbol ||
                          isSymbolCurrentlyDragging
                        }
                        isDropZoneActive={
                          isRankingLineActiveForHalo && showDraggableSymbol
                        }
                      />
                    </View>
                    <Text style={styles.currentScoreDisplay}>
                      Score: {score.toFixed(0)}
                    </Text>

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
                          (!selectedCity ||
                            showDraggableSymbol ||
                            isSymbolCurrentlyDragging) &&
                            styles.buttonDisabled,
                        ]}
                        onPress={handleAddOrUpdateRanking}
                        disabled={
                          !selectedCity ||
                          isSubmitting ||
                          showDraggableSymbol ||
                          isSymbolCurrentlyDragging
                        }
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
                )}

                {!selectedCity &&
                  !isSearchFocused &&
                  !isLoadingCities &&
                  !fetchError && (
                    <View style={styles.centeredPromptContainer}>
                      <Text style={styles.emptyListText}>
                        Search for a city to begin ranking.
                      </Text>
                    </View>
                  )}
                {fetchError &&
                  !isLoadingCities &&
                  !selectedCity &&
                  !isSearchFocused && (
                    <View style={styles.centeredPromptContainer}>
                      <Text style={styles.errorText}>{fetchError}</Text>
                    </View>
                  )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

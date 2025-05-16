import { useFocusEffect, useRouter } from "expo-router"; // useRouter for navigation, useFocusEffect to refetch data
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import apiService from "../../src/api/index";
import { AuthContext } from "../../src/context/AuthContext";
import { styles } from "../../src/screens/tabs/home.styles";
import { COLORS } from "../../src/theme";

// Define types for the data we expect from the API
interface City {
  id: number;
  name: string;
  country: string;
  // Add other city fields if they are part of your CityDisplay schema and needed here
}

interface UserCityRanking {
  id: number; // ID of the ranking entry itself
  personal_score: number;
  city: City;
  // Add other ranking fields if needed from UserCityRankingDisplay schema
}

export default function HomeScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [rankings, setRankings] = useState<UserCityRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start true to load initial data
  const [error, setError] = useState("");

  if (!authContext) {
    console.error("AuthContext is not available in HomeScreen.");
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          <Text style={{ color: COLORS.error }}>
            Authentication service unavailable.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  const { userInfo, logout } = authContext;

  const fetchRankings = useCallback(async () => {
    if (!userInfo) {
      // Don't fetch if no user info (e.g., logged out)
      setRankings([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await apiService.getUserRankings();
      setRankings(data);
    } catch (e: any) {
      setError(e.message || "Failed to fetch your ranked cities.");
      setRankings([]); // Clear rankings on error
    } finally {
      setIsLoading(false);
    }
  }, [userInfo]); // Dependency: re-run if userInfo changes (e.g., on login)

  // useFocusEffect is called when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchRankings();
    }, [fetchRankings]) // fetchRankings is memoized by useCallback
  );

  const renderRankingItem = ({ item }: { item: UserCityRanking }) => (
    <View style={styles.rankingItemCard}>
      <Text style={styles.rankingCity}>
        {item.city.name}, {item.city.country}
      </Text>
      <Text style={styles.rankingScore}>
        Your Score: {item.personal_score.toFixed(1)}
      </Text>
      {/* You could add a small TouchableOpacity here to edit/delete a ranking later */}
    </View>
  );

  const handleNavigateToAddRanking = () => {
    router.push("/(tabs)/addRanking");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Welcome, {userInfo?.username || "User"}!
          </Text>
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={logout}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonTextOutline}>Logout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleNavigateToAddRanking}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextPrimary}>Rank a City / Update</Text>
        </TouchableOpacity>

        {isLoading && rankings.length === 0 ? ( // Show main loader only if no data yet
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={fetchRankings}
            >
              <Text style={styles.buttonTextOutline}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : !isLoading && rankings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't ranked any cities yet.
            </Text>
            <Text style={styles.emptySubText}>
              Tap the button above to add your first ranking!
            </Text>
          </View>
        ) : (
          <FlatList
            data={rankings}
            renderItem={renderRankingItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            ListHeaderComponent={
              <Text style={styles.listHeader}>Your Ranked Cities</Text>
            }
            refreshing={isLoading} // For pull-to-refresh
            onRefresh={fetchRankings} // Pull-to-refresh functionality
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }} // Ensures space at the bottom of the list
          />
        )}
      </View>
    </SafeAreaView>
  );
}

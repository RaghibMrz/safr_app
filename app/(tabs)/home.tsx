// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import apiService from "../../src/api";
import { AuthContext } from "../../src/context/AuthContext";
import { SwipeableRankingItem } from "../../src/components/home/SwipeableRankingItem";
import { TypingAnimation } from "../../src/components/common/TypingAnimation";
import { styles } from "../../src/screens/tabs/home.styles";
import { COLORS, FONT_SIZES, SPACING } from "../../src/theme";
import { UserCityRanking } from "@/src/types/ranking";
import { welcomeMessages } from "@/src/screens/tabs/home.constants";

export default function HomeScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [rankings, setRankings] = useState<UserCityRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  if (!authContext) {
    console.error("AuthContext is not available in HomeScreen.");
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
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
      setRankings([]);
      setIsLoading(false);
      return;
    }
    setError("");
    try {
      const data = await apiService.getUserRankings();
      setRankings(data);
    } catch (e: any) {
      if (!e.message?.includes("Authentication expired")) {
        setError(e.message || "Failed to fetch your ranked cities.");
      }
      setRankings([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      fetchRankings();
    }, [fetchRankings])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRankings();
  }, [fetchRankings]);

  const handleDeleteRanking = async (rankingItem: UserCityRanking) => {
    try {
      await apiService.deleteRanking(rankingItem.city.id);
      // Optimistic update
      setRankings((prev) => prev.filter((r) => r.id !== rankingItem.id));
    } catch (e: any) {
      if (!e.message?.includes("Authentication expired")) {
        Alert.alert(
          "Error",
          `Failed to delete ranking for ${rankingItem.city.name}.`
        );
        // Refetch to restore correct state
        fetchRankings();
      }
    }
  };

  const handleNavigateToAddRanking = () => {
    router.push("/(tabs)/addRanking");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  // Calculate statistics
  const averageScore = useMemo(() => {
    if (rankings.length === 0) {
      return 0;
    }
    const totalScore = rankings.reduce((sum, r) => sum + r.personal_score, 0);
    return totalScore / rankings.length;
  }, [rankings]);

  const highestRated = useMemo(() => {
    return rankings.reduce<UserCityRanking | null>((maxAcc, currentRanking) => {
      if (!maxAcc || currentRanking.personal_score > maxAcc.personal_score) {
        return currentRanking;
      }
      return maxAcc;
    }, null);
  }, [rankings]);

  const renderHeader = () => (
    <View>
      {/* User Header - Extends behind status bar on iOS */}
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.gradientHeader,
            { backgroundColor: COLORS.primary },
            Platform.OS === "ios" && { paddingTop: 0 },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <TypingAnimation
                words={welcomeMessages}
                style={styles.greetingText}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
                shuffle={true}
              />
              <Text style={styles.usernameText}>
                {userInfo?.username || "Traveler"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      {rankings.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons
              name="flag"
              size={FONT_SIZES.xl3}
              color={COLORS.primary}
            />
            <Text style={styles.statNumber}>{rankings.length}</Text>
            <Text style={styles.statLabel}>Cities Ranked</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="stats-chart"
              size={FONT_SIZES.xl3}
              color={COLORS.primary}
            />
            <Text style={styles.statNumber}>{averageScore.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>

          {highestRated && (
            <View style={styles.statCard}>
              <Ionicons
                name="trophy"
                size={FONT_SIZES.xl3}
                color={COLORS.primary}
              />
              <Text style={styles.statText} numberOfLines={1}>
                {highestRated.city.name}
              </Text>
              <Text style={styles.statLabel}>Top Rated</Text>
            </View>
          )}
        </View>
      )}

      {/* Add Ranking Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addRankingButton}
          onPress={handleNavigateToAddRanking}
          activeOpacity={0.9}
        >
          <View
            style={[styles.gradientButton, { backgroundColor: COLORS.primary }]}
          >
            <Ionicons
              name="add-circle-outline"
              size={FONT_SIZES.xl3}
              color={COLORS.white}
            />
            <Text style={styles.addButtonText}>Rank a New City</Text>
          </View>
        </TouchableOpacity>
      </View>

      {rankings.length > 0 && (
        <Text style={styles.sectionTitle}>Your Rankings</Text>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={FONT_SIZES.logoLarge}
            color={COLORS.error}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRankings}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="map-outline"
          size={FONT_SIZES.logoExtraLarge}
          color={COLORS.textMuted}
        />
        <Text style={styles.emptyTitle}>No Cities Ranked Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start exploring and ranking cities you've visited or want to visit!
        </Text>
        <TouchableOpacity
          style={styles.emptyActionButton}
          onPress={handleNavigateToAddRanking}
        >
          <Text style={styles.emptyActionText}>Add Your First City</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={Platform.OS === "ios"}
      />
      <SafeAreaView
        style={[styles.safeArea, { flex: 0, backgroundColor: COLORS.primary }]}
      />
      <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
        <FlatList
          ref={flatListRef}
          data={rankings}
          renderItem={({ item, index }) => (
            <SwipeableRankingItem
              item={item}
              index={index}
              onDelete={handleDeleteRanking}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            rankings.length === 0 && styles.emptyListContent,
          ]}
        />
      </SafeAreaView>
    </View>
  );
}

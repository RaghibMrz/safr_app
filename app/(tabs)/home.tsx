// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import apiService from "../../src/api";
import { AuthContext } from "../../src/context/AuthContext";
import { styles } from "../../src/screens/tabs/home.styles";
import { COLORS, SPACING, TYPOGRAPHY } from "../../src/theme";
import { UserCityRanking } from "@/src/types/dtos";

export default function HomeScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [rankings, setRankings] = useState<UserCityRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

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
      // Don't show error if it's an auth error (API service will handle logout)
      if (!e.message?.includes("Authentication expired")) {
        setError(e.message || "Failed to fetch your ranked cities.");
      }
      setRankings([]);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      fetchRankings();
    }, [fetchRankings])
  );

  const handleDeleteRanking = async (rankingItem: UserCityRanking) => {
    Alert.alert(
      "Delete Ranking",
      `Are you sure you want to delete your ranking for ${rankingItem.city.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(rankingItem.id);
            setError("");
            try {
              await apiService.deleteRanking(rankingItem.city.id);
              await fetchRankings();
              Alert.alert(
                "Deleted!",
                `${rankingItem.city.name} ranking has been removed.`
              );
            } catch (e: any) {
              // Don't show error if it's an auth error
              if (!e.message?.includes("Authentication expired")) {
                setError(
                  e.message ||
                    `Failed to delete ranking for ${rankingItem.city.name}.`
                );
                Alert.alert(
                  "Error",
                  e.message ||
                    `Failed to delete ranking for ${rankingItem.city.name}.`
                );
              }
            } finally {
              setIsDeleting(null);
            }
          },
        },
      ]
    );
  };

  const renderRankingItem = ({ item }: { item: UserCityRanking }) => (
    <View style={styles.rankingItemCard}>
      <View style={styles.rankingItemContent}>
        <Text style={styles.rankingCity}>
          {item.city.name}, {item.city.country}
        </Text>
        <Text style={styles.rankingScore}>
          Your Score: {item.personal_score.toFixed(1)}
        </Text>
      </View>
      {isDeleting === item.id ? (
        <ActivityIndicator
          size="small"
          color={COLORS.error}
          style={styles.deleteButton}
        />
      ) : (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteRanking(item)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="remove-circle"
            size={TYPOGRAPHY.sizes.xxl}
            color={COLORS.error}
          />
        </TouchableOpacity>
      )}
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
            welcome, {userInfo?.username || "User"}.
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

        {isLoading && rankings.length === 0 ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : error && rankings.length === 0 ? (
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
            refreshing={isLoading}
            onRefresh={fetchRankings}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: SPACING.xl }}
            ListFooterComponent={
              error && rankings.length > 0 ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

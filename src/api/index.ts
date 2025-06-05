// src/api/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CityDisplay,
  TokenResponse,
  UserCityRanking,
  UserInfo,
} from "../types/dtos";

// --- Configuration ---
// Use your deployed API URL here
const API_BASE_URL = "http://192.168.1.42:8000";
// const API_BASE_URL = "https://safr-backend-t4t5dvi7da-nw.a.run.app";

// Store the logout callback
let authLogoutCallback: (() => Promise<void>) | null = null;

// Function to set the logout callback
export const setAuthLogoutCallback = (callback: () => Promise<void>) => {
  authLogoutCallback = callback;
};

// Helper to handle auth errors
const handleAuthError = async (response: Response, errorData: any) => {
  if (response.status === 401) {
    // Unauthorized - token is invalid/expired
    console.log("401 Unauthorized - logging out user");
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");

    // Trigger logout in the UI
    if (authLogoutCallback) {
      await authLogoutCallback();
    }

    throw new Error("Authentication expired. Please login again.");
  }
  throw new Error(errorData.detail || "Request failed");
};

// --- Helper to get the auth token ---
const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("userToken");
};

// --- API Service Object ---
const apiService = {
  // --- Auth Endpoints ---
  loginUser: async (username: string, password: string): Promise<string> => {
    console.log("Login attempt in apiService:", username, password);
    console.log("API_BASE_URL:", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`,
    });

    console.log("Login response in apiService:", response);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Login request failed" }));
      throw new Error(errorData.detail || "Login failed");
    }
    const data: TokenResponse = await response.json();
    return data.access_token;
  },

  signupUser: async (
    username: string,
    email: string,
    password: string
  ): Promise<UserInfo> => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Signup request failed" }));
      throw new Error(errorData.detail || "Signup failed");
    }
    return (await response.json()) as UserInfo;
  },

  getCurrentUser: async (token?: string): Promise<UserInfo> => {
    const authToken = token || (await getAuthToken());
    if (!authToken) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Failed to fetch user info" }));
      await handleAuthError(response, errorData);
    }
    return (await response.json()) as UserInfo;
  },

  // --- Cities Endpoints ---
  getCities: async (
    skip: number = 0,
    limit: number = 15000
  ): Promise<CityDisplay[]> => {
    const response = await fetch(
      `${API_BASE_URL}/cities/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Failed to fetch cities" }));
      throw new Error(errorData.detail || "Failed to fetch cities");
    }
    return (await response.json()) as CityDisplay[];
  },

  // --- Rankings Endpoints ---
  getUserRankings: async (): Promise<UserCityRanking[]> => {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error("Authentication required to fetch rankings.");
    }

    const response = await fetch(`${API_BASE_URL}/rankings/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Failed to fetch rankings" }));
      await handleAuthError(response, errorData);
    }
    return (await response.json()) as UserCityRanking[];
  },

  addOrUpdateRanking: async (
    cityId: number,
    personalScore: number
  ): Promise<UserCityRanking> => {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error("Authentication required to update ranking.");
    }

    const response = await fetch(`${API_BASE_URL}/rankings/cities/${cityId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ personal_score: personalScore }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Failed to update ranking" }));
      await handleAuthError(response, errorData);
    }
    return (await response.json()) as UserCityRanking;
  },

  deleteRanking: async (cityId: number): Promise<void> => {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error("Authentication required to delete ranking.");
    }

    const response = await fetch(`${API_BASE_URL}/rankings/cities/${cityId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Failed to delete ranking" }));
      await handleAuthError(response, errorData);
    }
  },
};

export default apiService;

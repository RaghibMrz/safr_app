// api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Configuration ---
// IMPORTANT: Replace with your actual backend URL.
// - For Android Emulator (if backend is on localhost): 'http://10.0.2.2:8000'
// - For iOS Simulator (if backend is on localhost): 'http://127.0.0.1:8000' or 'http://localhost:8000'
// - If backend is hosted, use its public URL.
// - If running on a physical device, use your computer's network IP address.
const API_BASE_URL = "http://192.168.1.42:8000";

// --- Helper to get the auth token ---
const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("userToken");
};

// --- Define expected response types (mirroring FastAPI Pydantic schemas) ---
interface UserInfo {
  // Matches UserDisplay schema from backend
  id: number;
  username: string;
  email: string;
  created_at: string; // Or Date
}

interface TokenResponse {
  // Matches Token schema from backend
  access_token: string;
  token_type: string;
}

interface City {
  // Matches CityDisplay schema from backend
  id: number;
  name: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  geoname_id?: string | null;
}

interface UserCityRanking {
  // Matches UserCityRankingDisplay schema from backend
  id: int;
  user_id: int;
  city_id: int;
  personal_score: number;
  objective_score?: number | null;
  created_at: string; // Or Date
  updated_at: string; // Or Date
  city: City;
}

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
      if (response.status === 401) {
        // Unauthorized, token might be invalid/expired
        // Consider triggering a logout or token refresh mechanism here
        // For now, just remove potentially bad stored data
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userInfo");
      }
      throw new Error(errorData.detail || "Failed to fetch user info");
    }
    return (await response.json()) as UserInfo;
  },

  // --- Cities Endpoints ---
  getCities: async (skip: number = 0, limit: number = 20): Promise<City[]> => {
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
    return (await response.json()) as City[];
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
      throw new Error(errorData.detail || "Failed to fetch rankings");
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
      throw new Error(errorData.detail || "Failed to add/update ranking");
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
        Accept: "application/json", // Even for 204, good to specify
      },
    });

    if (!response.ok && response.status !== 204) {
      // 204 is a success for DELETE
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Failed to delete ranking" }));
      throw new Error(errorData.detail || "Failed to delete ranking");
    }
    // No content to parse for 204 response
  },
};

export default apiService;

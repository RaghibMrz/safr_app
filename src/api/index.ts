// api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Custom Error for Unauthorized responses ---
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
    // This is important for instanceof checks
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

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

// --- Helper for authenticated API calls ---
const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new UnauthorizedError("Authentication token not found. Please log in.");
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json',
  };
  
  // Ensure 'Content-Type' is included for relevant methods
  if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: `Request failed with status ${response.status}` }));
    if (response.status === 401) {
      throw new UnauthorizedError(errorData.detail || `Unauthorized: Access to ${endpoint} denied.`);
    }
    throw new Error(errorData.detail || `API request to ${endpoint} failed with status ${response.status}`);
  }
  
  // For 204 No Content, return null or a specific indicator, as response.json() will fail
  if (response.status === 204) {
    return null; 
  }
  return await response.json();
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
    // If a token is passed directly (e.g. after login), use it. Otherwise authenticatedFetch will get it.
    // This direct token passing is primarily for the login flow.
    // For general use, authenticatedFetch handles token retrieval.
    if (token) {
       const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
         if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ detail: "Failed to fetch user info" }));
          if (response.status === 401) {
             throw new UnauthorizedError(errorData.detail || "User is not authorized");
          }
          throw new Error(errorData.detail || "Failed to fetch user info");
        }
        return (await response.json()) as UserInfo;
    }
    // For calls from within the app after login, rely on authenticatedFetch
    try {
      return await authenticatedFetch("/users/me", { method: "GET" }) as UserInfo;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error; // Re-throw UnauthorizedError as is
      }
      // Customize generic error message if needed for this specific endpoint
      throw new Error(error.message || "Failed to fetch user info via authenticatedFetch");
    }
  },

  // --- Cities Endpoints ---
  getCities: async (
    skip: number = 0,
    limit: number = 15000
  ): Promise<City[]> => {
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
    try {
      return await authenticatedFetch("/rankings/me", { method: "GET" }) as UserCityRanking[];
    } catch (error) {
      // Log or transform error if needed, otherwise rethrow
      console.error("Error in getUserRankings:", error);
      throw error;
    }
  },

  addOrUpdateRanking: async (
    cityId: number,
    personalScore: number
  ): Promise<UserCityRanking> => {
    try {
      return await authenticatedFetch(`/rankings/cities/${cityId}`, {
        method: "PUT",
        body: JSON.stringify({ personal_score: personalScore }),
        // 'Content-Type': 'application/json' is now handled by authenticatedFetch
      }) as UserCityRanking;
    } catch (error) {
      console.error("Error in addOrUpdateRanking:", error);
      throw error;
    }
  },

  deleteRanking: async (cityId: number): Promise<void> => {
    try {
      await authenticatedFetch(`/rankings/cities/${cityId}`, { method: "DELETE" });
      // No return needed as it's Promise<void>
    } catch (error) {
      console.error("Error in deleteRanking:", error);
      throw error;
    }
  },
};

export default apiService;

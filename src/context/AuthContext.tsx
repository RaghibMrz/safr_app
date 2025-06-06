// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "../api";
import { AuthContextType, UserInfo } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setUserToken(null);
      setUserInfo(null);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
    } catch (e) {
      console.error("Error removing auth data from AsyncStorage:", e);
    }
  }, []);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        return false;
      }

      const info = await apiService.getCurrentUser(token);
      setUserInfo(info);
      await AsyncStorage.setItem("userInfo", JSON.stringify(info));
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      console.log("Login attempt in AuthContext:", username);
      const token = await apiService.loginUser(username, password);
      console.log("Login successful in AuthContext");

      if (token) {
        setUserToken(token);
        await AsyncStorage.setItem("userToken", token);

        try {
          const info = await apiService.getCurrentUser(token);
          setUserInfo(info);
          await AsyncStorage.setItem("userInfo", JSON.stringify(info));
        } catch (userError) {
          console.error("Failed to fetch user info after login:", userError);
          // Still allow login to proceed even if user info fetch fails
        }
      } else {
        throw new Error("Login successful, but no token received.");
      }
    } catch (error: any) {
      console.error("Login error in AuthContext:", error);
      // Make sure to clear any partial state
      setUserToken(null);
      setUserInfo(null);
      // Re-throw the error so the login screen can display it
      throw error;
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const user = await apiService.signupUser(username, email, password);
      console.log("Signup successful in AuthContext:", user);
    } catch (error) {
      console.error("Signup error in AuthContext:", error);
      throw error;
    }
  };

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    console.log("Checking auth status...");
    try {
      const token = await AsyncStorage.getItem("userToken");
      const storedUserInfoString = await AsyncStorage.getItem("userInfo");

      if (token) {
        console.log("Token found in storage");
        setUserToken(token);

        if (storedUserInfoString) {
          try {
            const storedUserInfo = JSON.parse(storedUserInfoString) as UserInfo;
            setUserInfo(storedUserInfo);
            console.log("User info loaded from storage");
          } catch (parseError) {
            console.error("Error parsing stored user info:", parseError);
          }
        }

        // Validate token in the background
        validateToken()
          .then((isValid) => {
            if (!isValid) {
              console.log("Token is invalid, clearing auth state");
              // Clear auth state if token is invalid
              setUserToken(null);
              setUserInfo(null);
              AsyncStorage.removeItem("userToken");
              AsyncStorage.removeItem("userInfo");
            }
          })
          .catch((error) => {
            console.error("Error validating token:", error);
          });
      } else {
        console.log("No token found in storage");
      }
    } catch (e) {
      console.error("Error checking auth status:", e);
    } finally {
      // CRITICAL: Always set loading to false
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  }, [validateToken]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Set up the logout callback for the API service
  useEffect(() => {
    const { setAuthLogoutCallback } = require("../api");
    setAuthLogoutCallback(logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        validateToken,
        userToken,
        userInfo,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

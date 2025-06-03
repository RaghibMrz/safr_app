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
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
    } catch (e) {
      console.error("Error removing auth data from AsyncStorage:", e);
    }
    setIsLoading(false);
  }, []);

  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return false;

    try {
      const info = await apiService.getCurrentUser(token);
      setUserInfo(info);
      await AsyncStorage.setItem("userInfo", JSON.stringify(info));
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      await logout();
      return false;
    }
  }, [logout]);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Login attempt in AuthContext:", username, password);
      const token = await apiService.loginUser(username, password);
      console.log("Login successful in AuthContext:", token);
      if (token) {
        setUserToken(token);
        await AsyncStorage.setItem("userToken", token);

        const info = await apiService.getCurrentUser(token);
        setUserInfo(info);
        await AsyncStorage.setItem("userInfo", JSON.stringify(info));
      } else {
        throw new Error("Login successful, but no token received.");
      }
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await apiService.signupUser(username, email, password);
      console.log("Signup successful in AuthContext:", user);
    } catch (error) {
      console.error("Signup error in AuthContext:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const storedUserInfoString = await AsyncStorage.getItem("userInfo");

      if (token) {
        setUserToken(token);
        if (storedUserInfoString) {
          setUserInfo(JSON.parse(storedUserInfoString) as UserInfo);
        }
        await validateToken();
      }
    } catch (e) {
      console.error("Error checking login status from AsyncStorage:", e);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout, validateToken]);

  useEffect(() => {
    isLoggedIn();
  }, []);

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

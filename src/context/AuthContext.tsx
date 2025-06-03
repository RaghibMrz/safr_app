// AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// We will create api.ts in the next step.
import apiService from "../api"; // Assuming api.ts will be in the same directory

// Define types for the user information and context value
interface UserInfo {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  userToken: string | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  // If you need to expose setUserInfo or setUserToken directly, add them here
  // setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
  // setUserToken: Dispatch<SetStateAction<string | null>>;
}

// 1. Create the Authentication Context with a default undefined value
// or a default structure matching AuthContextType if preferred.
// Using undefined initially and checking for it in consumers is common.
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

// 2. Create the AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Login attempt in AuthContext:", username, password);
      const token = await apiService.loginUser(username, password);
      console.log("Login successful in AuthContext:", token);
      if (token) {
        setUserToken(token);
        await AsyncStorage.setItem("userToken", token);

        const info = await apiService.getCurrentUser(token); // getCurrentUser should return UserInfo
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
      const user = await apiService.signupUser(username, email, password); // signupUser should return UserInfo
      console.log("Signup successful in AuthContext:", user);
    } catch (error) {
      console.error("Signup error in AuthContext:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
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
  };

  const isLoggedIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const storedUserInfoString = await AsyncStorage.getItem("userInfo");

      if (token) {
        setUserToken(token);
        if (storedUserInfoString) {
          setUserInfo(JSON.parse(storedUserInfoString) as UserInfo);
        } else {
          try {
            const info = await apiService.getCurrentUser(token);
            setUserInfo(info);
            await AsyncStorage.setItem("userInfo", JSON.stringify(info));
          } catch (fetchError) {
            console.error(
              "Error fetching user info with stored token:",
              fetchError
            );
            await logout(); // Attempt to clear corrupted/stale state
          }
        }
      }
    } catch (e) {
      console.error("Error checking login status from AsyncStorage:", e);
      await logout(); // Attempt to clear corrupted state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        userToken,
        userInfo,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

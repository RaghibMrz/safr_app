export interface UserInfo {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  validateToken: () => Promise<boolean>;
  userToken: string | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
}

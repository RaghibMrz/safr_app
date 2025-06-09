// --- Define expected response types (mirroring FastAPI Pydantic schemas) ---
export interface UserInfo {
  // Matches UserDisplay schema from backend
  id: number;
  username: string;
  email: string;
  created_at: string; // Or Date
}

export interface TokenResponse {
  // Matches Token schema from backend
  access_token: string;
  token_type: string;
}

export interface CityDisplay {
  id: number;
  name: string;
  country_code: string;
  country_name: string;
  latitude?: number;
  longitude?: number;
  geoname_id?: string;
}

export interface UserCityRanking {
  // Matches UserCityRankingDisplay schema from backend
  id: number;
  user_id: number;
  city_id: number;
  personal_score: number;
  objective_score?: number | null;
  created_at: string; // Or Date
  updated_at: string; // Or Date
  city: CityDisplay;
}

import { City } from "./city";

export interface UserCityRanking {
  id: number;
  personal_score: number;
  city: City;
}

export interface SwipeableRankingItemProps {
  item?: UserCityRanking;
  onDelete: (item: UserCityRanking) => void;
  index: number;
}

export interface DraggableCityData extends City {
  score: number;
  color: string;
  position: { x: number; y: number };
}

export interface SearchResultItemProps {
  item: City;
  index: number;
}

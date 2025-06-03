import { City } from "./city";

export interface UserCityRanking {
  id: number;
  personal_score: number;
  city: City;
}

export interface SwipeableRankingItemProps {
  item: UserCityRanking;
  onDelete: (item: UserCityRanking) => void;
  index: number;
}

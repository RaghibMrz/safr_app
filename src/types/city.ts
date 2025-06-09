import { Animated, PanResponder } from "react-native";

export interface City {
  id: number;
  name: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
  geoname_id?: string;
  country_name?: string;
}

export interface CitySearchResult extends City {
  relevance?: number;
}

export interface DraggableCityProps {
  city: City & {
    color: string;
    score: number | null;
  };
  position: Animated.ValueXY;
  isDragging: boolean;
  panResponder: ReturnType<typeof PanResponder.create>["panHandlers"];
  onRemove: (cityId: number) => void;
}

import { Animated, PanResponder } from "react-native";

export interface City {
  id: number;
  name: string;
  country: string;
}

export interface DraggableCityProps {
  city: City & {
    color: string;
    score: number;
  };
  position: Animated.ValueXY;
  isDragging: boolean;
  panResponder: ReturnType<typeof PanResponder.create>["panHandlers"];
  onRemove: (cityId: number) => void;
}

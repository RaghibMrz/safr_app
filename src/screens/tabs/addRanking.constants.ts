// src/screens/tabs/addRanking.constants.ts
import { Dimensions, Platform } from "react-native";
import { SPACING } from "../../theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Dimensions
export const CITY_ICON_SIZE = 60;
export const RANKING_LINE_WIDTH = screenWidth - SPACING.xl * 2 - 60; // Account for labels
export const RANKING_LINE_HEIGHT = 80;
export const MODAL_HEIGHT_RATIO = 0.4;
export const IOS_ADJUST_MODAL = Platform.OS === "ios" ? 0.4 : 0;
export const IOS_ADJUST_WIDGET = Platform.OS === "ios" ? 80 : 0;

// Animation timings
export const MODAL_ANIMATION_DURATION = {
  OPEN: 300,
  CLOSE: 200,
};

export const SEARCH_DEBOUNCE_DELAY = 300;
export const FOCUS_INPUT_DELAY = 50;
export const MAX_SEARCH_RESULTS = 50;
export const MAX_CITIES_FETCH = 15000;

// Score markers
export const SCORE_MARKERS = [0, 25, 50, 75, 100];

// Layout constants
export const REMOVE_BUTTON_OFFSET = {
  x: 5,
  y: -5,
};

export const LINE_Y_OFFSET = 170; // Adjust for city spawn area

// Initial city grid layout
export const INITIAL_SPACING = SPACING.md;
export const ICONS_PER_ROW = 5;

// Colors for cities
export const CITY_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
  "#54A0FF",
  "#48DBFB",
  "#1DD1A1",
  "#FFA502",
];

export const MAX_UNRANKED_CITIES = 10;

export const WIDGET_CITY_NAME_MAX_LENGTH = 3;

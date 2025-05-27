import React, { useEffect, useCallback } from "react"; // Import useCallback from React
import { View, Text, Dimensions } from "react-native";
import {
  PanGestureHandler,
  TapGestureHandler,
  State as GestureState,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  // withSpring, // Currently not used, can be removed or kept for future use
  runOnJS,
  useAnimatedGestureHandler, // Ensure this is the one from 'react-native-reanimated'
} from "react-native-reanimated";

import { styles } from "./RankingSlider.styles";
import { SPACING } from "../../theme"; // Adjust path as needed

interface RankingSliderProps {
  initialScore?: number; // Score from 0 to 100
  onScoreChange: (score: number) => void;
  cityInitial?: string; // Optional: to display in the marker
  disabled?: boolean;
}

const TRACK_WIDTH_PERCENTAGE = 0.9;
const MARKER_SIZE = SPACING["3xl"]; // 32

// Define a type for the context object used in PanGestureHandler
type PanGestureContext = {
  startX: number;
};

export const RankingSlider: React.FC<RankingSliderProps> = ({
  initialScore = 50,
  onScoreChange,
  cityInitial,
  disabled = false,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const componentPaddingHorizontal = SPACING.lg * 2; // Assuming styles.container has this padding
  // trackWidth is the visual track, not the full component width
  const calculatedTrackWidth =
    (screenWidth - componentPaddingHorizontal) * TRACK_WIDTH_PERCENTAGE;

  const translateX = useSharedValue(0);
  const currentScore = useSharedValue(initialScore);
  const trackLayoutWidth = useSharedValue(0); // Will be set by onLayout

  const internalScoreToPosition = useCallback(
    (score: number, currentTrackWidth: number): number => {
      if (currentTrackWidth === 0) return 0;
      const position = (score / 100) * currentTrackWidth;
      return Math.max(0, Math.min(position, currentTrackWidth));
    },
    []
  );

  const internalPositionToScore = useCallback(
    (position: number, currentTrackWidth: number): number => {
      if (currentTrackWidth === 0) return 50; // Default if track not measured
      const rawScore = (position / currentTrackWidth) * 100;
      return Math.round(Math.max(0, Math.min(rawScore, 100)));
    },
    []
  );

  useEffect(() => {
    if (trackLayoutWidth.value > 0) {
      const initialPosition = internalScoreToPosition(
        initialScore,
        trackLayoutWidth.value
      );
      translateX.value = initialPosition;
      currentScore.value = initialScore;
    }
  }, [initialScore, trackLayoutWidth.value, internalScoreToPosition]);

  const updateScoreAndPosition = (
    newPosition: number,
    currentTrackWidth: number
  ) => {
    "worklet";
    const boundedPosition = Math.max(
      0,
      Math.min(newPosition, currentTrackWidth)
    );
    translateX.value = boundedPosition;
    const score = internalPositionToScore(boundedPosition, currentTrackWidth);
    currentScore.value = score;
    runOnJS(onScoreChange)(score);
  };

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    PanGestureContext
  >({
    onStart: (_, ctx) => {
      if (disabled) return;
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      if (disabled) return;
      if (trackLayoutWidth.value > 0) {
        const newPosition = ctx.startX + event.translationX;
        updateScoreAndPosition(newPosition, trackLayoutWidth.value);
      }
    },
    onEnd: () => {
      if (disabled) return;
      // translateX.value = withSpring(translateX.value); // Optional spring effect
    },
  });

  const tapGestureEvent = (event: TapGestureHandlerStateChangeEvent) => {
    if (disabled) return;
    if (event.nativeEvent.state === GestureState.ACTIVE) {
      if (trackLayoutWidth.value > 0) {
        const tapX = event.nativeEvent.x;
        updateScoreAndPosition(tapX, trackLayoutWidth.value);
      }
    }
  };

  const animatedMarkerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - MARKER_SIZE / 2 }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Tap or drag on the line to set your initial rating.
      </Text>
      <TapGestureHandler
        onHandlerStateChange={tapGestureEvent}
        enabled={!disabled}
      >
        <Animated.View
          style={styles.trackContainer}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            if (trackLayoutWidth.value === 0 && width > 0) {
              trackLayoutWidth.value = width;
              const initialPosition = internalScoreToPosition(
                currentScore.value,
                width
              );
              translateX.value = initialPosition;
            }
          }}
        >
          <View style={styles.track} />
          <PanGestureHandler
            onGestureEvent={panGestureEvent}
            enabled={!disabled}
          >
            <Animated.View
              style={[styles.markerContainer, animatedMarkerStyle]}
            >
              <View style={styles.marker}>
                {cityInitial && (
                  <Text style={styles.markerText}>{cityInitial}</Text>
                )}
              </View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>Rubbish (0)</Text>
        <Text style={styles.label}>Perfect (100)</Text>
      </View>
    </View>
  );
};

// src/components/ranking/RankingSlider.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Platform,
  StyleSheet as RNStyleSheet,
} from "react-native";
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
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  // withSpring, // Available if needed
} from "react-native-reanimated";

import { styles } from "./RankingSlider.styles";
import { SPACING, COLORS, TYPOGRAPHY } from "../../theme"; // Adjust path as needed

interface RankingSliderProps {
  initialScore?: number;
  onScoreChange: (score: number) => void;
  cityInitial?: string;
  disabled?: boolean;
}

const TRACK_WIDTH_PERCENTAGE = 0.9;
const MARKER_SIZE =
  styles.marker.width && typeof styles.marker.width === "number"
    ? styles.marker.width
    : SPACING["3xl"]; // Ensure MARKER_SIZE is a number

type PanGestureContext = {
  startX: number;
};

export const RankingSlider: React.FC<RankingSliderProps> = ({
  initialScore = 50,
  onScoreChange,
  cityInitial,
  disabled = false,
}) => {
  const translateX = useSharedValue(0); // Center position of the marker on the track
  const trackWidth = useSharedValue(0); // Actual measured width of the track

  const callOnScoreChange = useCallback(
    (score: number) => {
      onScoreChange(score);
    },
    [onScoreChange]
  );

  // Effect to update marker position if initialScore prop changes
  useEffect(() => {
    if (trackWidth.value > 0) {
      // Only if track has been measured
      const newPosition = interpolate(
        initialScore,
        [0, 100],
        [0, trackWidth.value],
        Extrapolate.CLAMP
      );
      if (isFinite(newPosition)) {
        // Update translateX only if it's different to avoid unnecessary updates
        // translateX.value = withTiming(newPosition, { duration: 50 }); // Optional: animate change
        translateX.value = newPosition;
      }
    }
    // This effect primarily reacts to initialScore.
    // trackWidth.value itself shouldn't be in dependencies to avoid Reanimated warnings.
    // The onLayout callback will handle changes due to trackWidth.
  }, [initialScore, trackWidth]); // Depend on trackWidth OBJECT for re-eval if it was remade,
  // but the logic inside checks its .value.
  // Reanimated's strict mode might still warn if it sees .value read here
  // even if the effect is for initialScore.
  // A more advanced pattern uses useAnimatedReaction for SV changes.

  const updateScoreAndPositionFromGesture = (
    newXPosition: number,
    currentTrackWidth: number
  ) => {
    "worklet";
    if (currentTrackWidth === 0) return;

    const boundedPosition = Math.max(
      0,
      Math.min(newXPosition, currentTrackWidth)
    );
    if (isFinite(boundedPosition)) {
      translateX.value = boundedPosition;
      const newScore = interpolate(
        boundedPosition,
        [0, currentTrackWidth],
        [0, 100],
        Extrapolate.CLAMP
      );
      runOnJS(callOnScoreChange)(Math.round(newScore));
    }
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
      if (disabled || trackWidth.value === 0) return;
      updateScoreAndPositionFromGesture(
        ctx.startX + event.translationX,
        trackWidth.value
      );
    },
    onEnd: () => {
      if (disabled) return;
      // Optional: withSpring(translateX.value, { damping: 15, stiffness: 150 });
    },
  });

  const tapGestureEvent = (event: TapGestureHandlerStateChangeEvent) => {
    if (disabled || trackWidth.value === 0) return;
    if (event.nativeEvent.state === GestureState.ACTIVE) {
      updateScoreAndPositionFromGesture(event.nativeEvent.x, trackWidth.value);
    }
  };

  const animatedMarkerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - MARKER_SIZE / 2 }],
    };
  });

  const handleTrackLayout = useCallback(
    (event: import("react-native").LayoutChangeEvent) => {
      const newWidth = event.nativeEvent.layout.width;
      if (newWidth > 0 && trackWidth.value !== newWidth) {
        trackWidth.value = newWidth;
        // When track width is first set or changes, re-apply initialScore to position marker
        const initialPosition = interpolate(
          initialScore, // Use the current initialScore prop
          [0, 100],
          [0, newWidth],
          Extrapolate.CLAMP
        );
        if (isFinite(initialPosition)) {
          translateX.value = initialPosition;
        }
      }
    },
    [initialScore, trackWidth]
  ); // trackWidth object as dependency is fine for useCallback

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Tap or drag on the line to set your rating.
      </Text>
      <TapGestureHandler
        onHandlerStateChange={tapGestureEvent}
        enabled={!disabled}
      >
        <Animated.View
          style={styles.trackContainer}
          onLayout={handleTrackLayout} // Use memoized layout handler
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

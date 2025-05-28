// src/components/ranking/RankingSlider.tsx
import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  LayoutChangeEvent,
  Dimensions,
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
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { styles } from "./RankingSlider.styles";
import { SPACING, COLORS, TYPOGRAPHY } from "../../theme";

interface RankingSliderProps {
  currentScore: number;
  onScoreChange: (newScore: number) => void;
  disabled?: boolean;
  isDropZoneActive?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const MARKER_SIZE = styles.marker.width || 24; // From updated styles

type SliderPanGestureContext = {
  startX: number;
};

export const RankingSlider: React.FC<RankingSliderProps> = ({
  currentScore,
  onScoreChange,
  disabled = false,
  isDropZoneActive = false,
  onLayout,
}) => {
  const markerPositionX = useSharedValue(0);
  const trackWidthSV = useSharedValue(0);

  const callOnScoreChange = useCallback(
    (score: number) => {
      onScoreChange(score);
    },
    [onScoreChange]
  );

  useEffect(() => {
    if (trackWidthSV.value > 0) {
      const newPosition = interpolate(
        currentScore,
        [0, 100],
        [0, trackWidthSV.value],
        Extrapolate.CLAMP
      );
      if (isFinite(newPosition)) {
        markerPositionX.value = withTiming(newPosition, { duration: 100 }); // Faster animation
      }
    } else {
      const estimatedTrackWidth = Dimensions.get("window").width * 0.8;
      const newPosition = interpolate(
        currentScore,
        [0, 100],
        [0, estimatedTrackWidth],
        Extrapolate.CLAMP
      );
      if (isFinite(newPosition)) {
        markerPositionX.value = newPosition;
      }
    }
  }, [currentScore, trackWidthSV.value]);

  const onInnerTrackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const newWidth = event.nativeEvent.layout.width;
      if (newWidth > 0 && trackWidthSV.value !== newWidth) {
        trackWidthSV.value = newWidth;
      }
    },
    [trackWidthSV]
  );

  const animatedMarkerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: markerPositionX.value - MARKER_SIZE / 2 }],
  }));

  const sliderPanGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    SliderPanGestureContext
  >({
    /* ... same ... */
  });
  const trackTapGestureEvent = (event: TapGestureHandlerStateChangeEvent) => {
    /* ... same ... */
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.instructionText}>
        {disabled
          ? "Drag city symbol above or fine-tune score here."
          : "Tap or drag on the line to set rating."}
      </Text>
      <TapGestureHandler
        onHandlerStateChange={trackTapGestureEvent}
        enabled={!disabled}
      >
        <Animated.View
          style={styles.trackContainer}
          onLayout={onInnerTrackLayout}
        >
          {isDropZoneActive && <View style={styles.trackHalo} />}
          <View style={styles.track} />
          <PanGestureHandler
            onGestureEvent={sliderPanGestureEvent}
            enabled={!disabled}
          >
            <Animated.View
              style={[styles.markerContainer, animatedMarkerStyle]}
            >
              <View style={styles.marker} />
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

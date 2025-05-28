// src/components/ranking/DraggableCitySymbol.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";

import { styles } from "./DraggableCitySymbol.styles";
import { City } from "../../api"; // Adjust path: e.g., '../../types'
import { WithSpringConfig } from "react-native-reanimated";

const springConfig: WithSpringConfig = {
  damping: 15,
  stiffness: 180,
  mass: 0.7,
};

interface DraggableCitySymbolProps {
  city: City | null;
  // These are the TARGET absolute screen coordinates for the symbol's top-left.
  // The component will animate to these when isVisible is true and not dragging.
  targetScreenX: number;
  targetScreenY: number;
  onDragStart?: () => void;
  // Reports current absolute top-left screen coordinates of the symbol DURING drag
  onDragActiveUpdate?: (currentScreenX: number, currentScreenY: number) => void;
  // Called when drag gesture ends, reporting final absolute top-left screen coordinates
  onDragEnd: (finalScreenX: number, finalScreenY: number) => void;
  isVisible: boolean;
}

// Context for the PanGestureHandler
type DragContext = {
  // The initial top-left position of the symbol when the drag started
  // These are absolute screen coordinates.
  startScreenX: number;
  startScreenY: number;
};

export const DraggableCitySymbol: React.FC<DraggableCitySymbolProps> = ({
  city,
  targetScreenX,
  targetScreenY,
  onDragStart,
  onDragActiveUpdate,
  onDragEnd,
  isVisible,
}) => {
  // These shared values represent the current top-left position of the symbol on the screen.
  // Initialize them based on initial props.
  const translateX = useSharedValue(targetScreenX);
  const translateY = useSharedValue(targetScreenY);
  const isDragging = useSharedValue(false);

  // This useEffect ensures the symbol animates to its target position
  // when the targetScreenX/Y props change AND it's not currently being dragged.
  // This is crucial for initial placement and for the "snap-back" feature.
  useEffect(() => {
    // Ensure props are numbers before using them for animation
    const validTargetX =
      typeof targetScreenX === "number" && isFinite(targetScreenX)
        ? targetScreenX
        : 0;
    const validTargetY =
      typeof targetScreenY === "number" && isFinite(targetScreenY)
        ? targetScreenY
        : 0;

    if (!isDragging.value) {
      // Only animate if not actively being dragged
      if (isVisible) {
        // Cancel any ongoing animation before starting a new one to prevent conflicts
        cancelAnimation(translateX);
        cancelAnimation(translateY);
        translateX.value = withSpring(validTargetX, springConfig);
        translateY.value = withSpring(validTargetY, springConfig);
      } else {
        // If becoming invisible, instantly move it to the target position (or off-screen)
        // so it's correctly placed if it's made visible again.
        translateX.value = validTargetX;
        translateY.value = validTargetY;
      }
    }
  }, [targetScreenX, targetScreenY, isVisible]); // isDragging.value is checked *inside* the effect

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    DragContext
  >({
    onStart: (event, ctx) => {
      cancelAnimation(translateX); // Stop any ongoing snap-back animation
      cancelAnimation(translateY);
      isDragging.value = true;
      // Store the current animated position as the starting point for this gesture's deltas
      ctx.startScreenX = translateX.value;
      ctx.startScreenY = translateY.value;
      if (onDragStart) {
        runOnJS(onDragStart)();
      }
    },
    onActive: (event, ctx) => {
      if (!isDragging.value) return;
      // New position = starting position of symbol + total translation of the gesture since start
      // event.translationX/Y are deltas from the point where the gesture started.
      translateX.value = ctx.startScreenX + event.translationX;
      translateY.value = ctx.startScreenY + event.translationY;

      if (onDragActiveUpdate) {
        runOnJS(onDragActiveUpdate)(translateX.value, translateY.value);
      }
    },
    onEnd: () => {
      isDragging.value = false;
      // Report the final absolute screen coordinates of the symbol's top-left.
      runOnJS(onDragEnd)(translateX.value, translateY.value);
      // The parent (AddRankingScreen) will now decide the next targetScreenX/Y
      // for this symbol by updating this component's props.
      // The useEffect above will then handle the animation if targetScreenX/Y change.
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isDragging.value ? 1.12 : 1, springConfig) },
      ],
      position: "absolute", // Positioned absolutely relative to its nearest positioned ancestor (or screen root)
      left: 0, // translateX/Y are the absolute top-left coordinates relative to that ancestor/root
      top: 0,
      zIndex: isDragging.value ? 1000 : 100, // Elevate when dragging
      opacity: isVisible ? 1 : 0, // Control visibility
    };
  });

  if (!city) {
    return null;
  }
  // If not visible, render nothing to avoid touch issues with an invisible element.
  // The opacity in animatedStyle handles the visual fade-out/in.
  if (!isVisible && !isDragging.value) {
    // Also ensure it's not mid-drag when becoming invisible
    return null;
  }

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={isVisible}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.symbol}>
          <Text style={styles.symbolText}>
            {city.name ? city.name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

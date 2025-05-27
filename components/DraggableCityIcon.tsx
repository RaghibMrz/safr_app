// components/DraggableCityIcon.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { COLORS, SPACING, TYPOGRAPHY, FONT_WEIGHTS } from "../src/theme";

interface City {
  id: number;
  name: string;
  country: string;
}

interface DraggableCityIconProps {
  city: City;
  onDrop: (cityId: number, score: number) => void;
  rankingAreaLayout: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  getYToScoreMapping: (
    yPositionInRankingArea: number,
    rankingAreaHeight: number
  ) => number;
  initialScreenX: number;
  initialScreenY: number;
  iconWidth?: number;
  iconHeight?: number;
  isVisible: boolean;
  isEnabled: boolean;
}

type AnimatedGHContext = {
  startX: number;
  startY: number;
};

const DEFAULT_ICON_WIDTH = 150;
const DEFAULT_ICON_HEIGHT = 50;

const DraggableCityIcon: React.FC<DraggableCityIconProps> = ({
  city,
  onDrop,
  rankingAreaLayout,
  getYToScoreMapping,
  initialScreenX,
  initialScreenY,
  iconWidth = DEFAULT_ICON_WIDTH,
  iconHeight = DEFAULT_ICON_HEIGHT,
  isVisible,
  isEnabled,
}) => {
  const screenX = useSharedValue(initialScreenX);
  const screenY = useSharedValue(initialScreenY);

  React.useEffect(() => {
    if (
      isVisible &&
      initialScreenX !== undefined &&
      initialScreenY !== undefined
    ) {
      // console.log(`DraggableCityIcon ${city.name}: Animating to initialScreenX=${initialScreenX}, initialScreenY=${initialScreenY}`);
      screenX.value = withSpring(initialScreenX, {
        damping: 18,
        stiffness: 120,
      });
      screenY.value = withSpring(initialScreenY, {
        damping: 18,
        stiffness: 120,
      });
    }
  }, [initialScreenX, initialScreenY, isVisible, screenX, screenY, city.name]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      // console.log(`DraggableCityIcon ${city.name}: Drag Start`);
      ctx.startX = screenX.value;
      ctx.startY = screenY.value;
    },
    onActive: (event, ctx) => {
      screenX.value = ctx.startX + event.translationX;
      screenY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      // console.log(`DraggableCityIcon ${city.name}: Drag End. rankingAreaLayout:`, JSON.stringify(rankingAreaLayout));
      // console.log(`DraggableCityIcon ${city.name}: Current screenX=${screenX.value}, screenY=${screenY.value}`);

      if (
        rankingAreaLayout &&
        typeof rankingAreaLayout.x === "number" &&
        typeof rankingAreaLayout.y === "number" &&
        typeof rankingAreaLayout.width === "number" &&
        rankingAreaLayout.width > 0 &&
        typeof rankingAreaLayout.height === "number" &&
        rankingAreaLayout.height > 0
      ) {
        const currentIconX = screenX.value;
        const currentIconY = screenY.value;

        const iconCenterX = currentIconX + iconWidth / 2;
        const iconCenterY = currentIconY + iconHeight / 2;

        // console.log(`DraggableCityIcon ${city.name}: iconCenterX=${iconCenterX}, iconCenterY=${iconCenterY}`);
        // console.log(`DraggableCityIcon ${city.name}: Drop Target X Range: ${rankingAreaLayout.x} to ${rankingAreaLayout.x + rankingAreaLayout.width}`);
        // console.log(`DraggableCityIcon ${city.name}: Drop Target Y Range: ${rankingAreaLayout.y} to ${rankingAreaLayout.y + rankingAreaLayout.height}`);

        const isWithinX =
          iconCenterX >= rankingAreaLayout.x &&
          iconCenterX <= rankingAreaLayout.x + rankingAreaLayout.width;
        const isWithinY =
          iconCenterY >= rankingAreaLayout.y &&
          iconCenterY <= rankingAreaLayout.y + rankingAreaLayout.height;

        // console.log(`DraggableCityIcon ${city.name}: isWithinX=${isWithinX}, isWithinY=${isWithinY}`);

        if (isWithinX && isWithinY) {
          const yPositionInRankingArea = iconCenterY - rankingAreaLayout.y;
          // console.log(`DraggableCityIcon ${city.name}: yPositionInRankingArea=${yPositionInRankingArea}, rankingAreaLayout.height=${rankingAreaLayout.height}`);

          const score = getYToScoreMapping(
            yPositionInRankingArea,
            rankingAreaLayout.height
          );
          // console.log(`DraggableCityIcon ${city.name}: Calculated score=${score}`);

          if (typeof score === "number" && !isNaN(score)) {
            runOnJS(onDrop)(city.id, score);
          } else {
            if (__DEV__) {
              console.warn(
                `DraggableCityIcon ${city.name}: Calculated score was invalid.`,
                {
                  score,
                  yPositionInRankingArea,
                  rankingAreaHeight: rankingAreaLayout.height,
                }
              );
            }
            screenX.value = withSpring(initialScreenX);
            screenY.value = withSpring(initialScreenY);
          }
        } else {
          // console.log(`DraggableCityIcon ${city.name}: Dropped outside. Snapping back.`);
          screenX.value = withSpring(initialScreenX);
          screenY.value = withSpring(initialScreenY);
        }
      } else {
        if (__DEV__) {
          console.warn(
            `DraggableCityIcon ${city.name}: rankingAreaLayout was null or had invalid dimensions on drop. Snapping back. Layout:`,
            JSON.stringify(rankingAreaLayout)
          );
        }
        screenX.value = withSpring(initialScreenX);
        screenY.value = withSpring(initialScreenY);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: screenX.value,
      top: screenY.value,
      width: iconWidth,
      height: iconHeight,
      opacity: isVisible ? 1 : 0,
      zIndex: 100,
    };
  });

  if (
    !isVisible &&
    (initialScreenX === undefined || initialScreenY === undefined)
  ) {
    return null;
  }

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      enabled={isEnabled && isVisible}
    >
      <Animated.View style={[styles.draggableContainer, animatedStyle]}>
        <Text style={styles.iconText}>📍</Text>
        <Text style={styles.cityText} numberOfLines={1} ellipsizeMode="tail">
          {city.name}
        </Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: SPACING.xs,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.white,
  },
  cityText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.white,
    flexShrink: 1,
  },
});

export default DraggableCityIcon;

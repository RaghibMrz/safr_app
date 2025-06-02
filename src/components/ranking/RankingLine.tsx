// src/components/RankingLine.tsx
import React, { forwardRef } from "react";
import { Text, View } from "react-native";

import { styles } from "../../screens/tabs/addRanking.styles";
import { SCORE_MARKERS } from "../../screens/tabs/addRanking.constants";

interface RankingLineProps {
  onLayout: (event: any) => void;
}

export const RankingLine = forwardRef<View, RankingLineProps>(
  ({ onLayout }, ref) => {
    return (
      <View style={styles.rankingContainer}>
        <Text style={styles.rankingLabelLeft}>0</Text>
        <View ref={ref} style={styles.rankingLineWrapper} onLayout={onLayout}>
          <View style={styles.rankingLine} />
          {SCORE_MARKERS.map((value) => (
            <View
              key={value}
              style={[styles.scoreMarker, { left: `${value}%` }]}
            >
              <View style={styles.markerLine} />
              <Text style={styles.markerText}>{value}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.rankingLabelRight}>100</Text>
      </View>
    );
  }
);

RankingLine.displayName = "RankingLine";

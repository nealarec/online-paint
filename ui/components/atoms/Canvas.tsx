import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path as SvgPath, G } from "react-native-svg";
import { Drawing, Path } from "@paint/shared";
// import Animated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';

// const AnimatedPath = Animated.createAnimatedComponent(SvgPath);

interface CanvasProps {
  drawing: Drawing;
  currentPath: Path | null;
  width?: number | string;
  height?: number | string;
  style?: object;
}

export const Canvas: React.FC<CanvasProps> = ({
  drawing,
  currentPath,
  width = "100%",
  height = "100%",
  style,
}) => {
  const renderPath = (path: Path, index: number) => {
    if (path.points.length < 2) return null;

    let d = `M${path.points[0].x},${path.points[0].y}`;
    for (let i = 1; i < path.points.length; i++) {
      d += ` L${path.points[i].x},${path.points[i].y}`;
    }

    return (
      <SvgPath
        key={`path-${index}`}
        d={d}
        stroke={path.color}
        strokeWidth={path.weight}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
    );
  };

  return (
    <View style={[styles.container, style, { width, height }]}>
      <Svg style={styles.svg}>
        <G>
          {drawing.paths.map((path, index) => renderPath(path, index))}
          {currentPath && renderPath(currentPath, -1)}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  svg: {
    flex: 1,
  },
});

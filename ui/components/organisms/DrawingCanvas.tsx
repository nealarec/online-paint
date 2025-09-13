import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Canvas } from "../atoms/Canvas";
import { DrawingToolbar } from "../molecules/DrawingToolbar";
import { useDrawing } from "../../hooks/useDrawing";
import { useDrawingStore } from "../../store/useDrawingStore";
import { useRoomStore } from "store/useRoomStore";
import useAllPaths from "hooks/useAllPaths";

export const DrawingCanvas: React.FC = () => {
  const { users } = useRoomStore();
  const { currentDrawing, currentPath } = useDrawingStore();
  const { panResponder } = useDrawing();

  const collaborativeDrawing = {
    name: "Collaborative Drawing",
    paths: useAllPaths(),
  };
  console.log(useAllPaths());
  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Canvas drawing={collaborativeDrawing} currentPath={currentPath} />
      </View>
      <DrawingToolbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
});

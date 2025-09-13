import { useCallback } from "react";
import { GestureResponderEvent, PanResponder } from "react-native";
import { Point } from "@paint/shared";
import { useDrawingStore } from "../store/useDrawingStore";

export const useDrawing = () => {
  const { startDrawing, draw, endDrawing } = useDrawingStore();

  const handleStart = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      const { locationX: x, locationY: y } = event.nativeEvent;
      startDrawing({ x, y });
    },
    [startDrawing]
  );

  const handleMove = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      const { locationX: x, locationY: y } = event.nativeEvent;
      draw({ x, y });
    },
    [draw]
  );

  const handleEnd = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: handleStart,
    onPanResponderMove: handleMove,
    onPanResponderRelease: handleEnd,
    onPanResponderTerminate: handleEnd,
  });

  return {
    panResponder,
    handleStart,
    handleMove,
    handleEnd,
  };
};

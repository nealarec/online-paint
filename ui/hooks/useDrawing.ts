import { useCallback, useRef } from "react";
import { GestureResponderEvent, PanResponder } from "react-native";
import { useDrawingStore } from "../store/useDrawingStore";
import { useRoomStore } from "../store/useRoomStore";

export const useDrawing = () => {
  const { startDrawing, draw, endDrawing } = useDrawingStore();
  const { roomId, sendDrawStart, sendDrawUpdate, sendDrawEnd } = useRoomStore();
  const isDrawingRef = useRef(false);

  const handleStart = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      const { locationX: x, locationY: y } = event.nativeEvent;
      const point = { x, y };

      // Start local drawing
      startDrawing(point);

      // Start remote drawing
      if (roomId) {
        const path = {
          points: [point],
          color: useDrawingStore.getState().color,
          weight: useDrawingStore.getState().weight,
          tool: useDrawingStore.getState().tool,
        };
        sendDrawStart(point);
      }

      isDrawingRef.current = true;
    },
    [startDrawing, roomId, sendDrawStart]
  );

  const handleMove = useCallback(
    (event: GestureResponderEvent) => {
      if (!isDrawingRef.current) return;

      event.stopPropagation();
      const { locationX: x, locationY: y } = event.nativeEvent;
      const point = { x, y };

      // Update local drawing
      const updatedPath = draw(point);

      // Update remote drawing
      if (roomId && updatedPath) {
        sendDrawUpdate(updatedPath);
      }
    },
    [draw, roomId, sendDrawUpdate]
  );

  const handleEnd = useCallback(() => {
    if (!isDrawingRef.current) return;
    // End remote drawing
    if (roomId) {
      const currentPath = useDrawingStore.getState().currentPath;
      if (currentPath) sendDrawEnd(currentPath);
    }

    // End local drawing
    endDrawing();
    isDrawingRef.current = false;
  }, [endDrawing, roomId, sendDrawEnd]);

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
    isDrawing: isDrawingRef.current,
  };
};

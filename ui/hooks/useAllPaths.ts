import { useMemo } from "react";
import { useRoomStore } from "../store/useRoomStore";
import { getAllPaths as roomAllPaths } from "../store/useRoomStore";
import { useDrawingStore } from "../store/useDrawingStore";
import { allPaths as drawingAllPaths } from "../store/useDrawingStore";

export default function useAllPaths() {
  const room = useRoomStore();
  const drawing = useDrawingStore();
  return useMemo(
    () => [...roomAllPaths(room), ...drawingAllPaths(drawing)],
    [room, drawing]
  );
}

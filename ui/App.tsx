import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MainTemplate } from "./components/templates/MainTemplate";
import { DrawingCanvas } from "./components/organisms/DrawingCanvas";
import { useRoomStore } from "./store/useRoomStore";
import { JoinRoomForm } from "./components/organisms/JoinRoomForm";
import { Text } from "react-native";

export default function App() {
  const { isConnected, roomId, currentUser } = useRoomStore();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <MainTemplate title="Paint App" scrollable={false}>
          {isConnected && roomId && currentUser ? (
            <>
              <Text>Room {roomId}</Text>
              <DrawingCanvas />
            </>
          ) : (
            <JoinRoomForm
              onJoin={(roomId: string, username: string) =>
                useRoomStore.getState().joinRoom(roomId, username)
              }
            />
          )}
        </MainTemplate>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

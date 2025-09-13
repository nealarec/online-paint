import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MainTemplate } from "./components/templates/MainTemplate";
import { DrawingCanvas } from "./components/organisms/DrawingCanvas";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <MainTemplate title="Paint App" scrollable={false}>
          <DrawingCanvas />
        </MainTemplate>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

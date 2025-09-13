import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { greet } from "@paint/shared";
import { ApiResponse } from "@paint/shared/types";

const res: ApiResponse<string> = {
  data: "NElsins",
  status: 200,
};

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Text>Shared: {greet(res.data)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

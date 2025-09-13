import { Text, TextInput, View } from "react-native";

import { Button } from "../atoms/Button";
import React from "react";

export const JoinRoomForm: React.FC<{
  onJoin: (roomId: string, username: string) => void;
}> = ({ onJoin }) => {
  const [roomId, setRoomId] = React.useState("");
  const [username, setUsername] = React.useState("");
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>Room ID:</Text>
      <TextInput
        value={roomId}
        onChangeText={setRoomId}
        style={{
          borderWidth: 1,
          borderColor: "#E5E5EA",
          borderRadius: 8,
          padding: 8,
        }}
      ></TextInput>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: "#E5E5EA",
          borderRadius: 8,
          padding: 8,
        }}
      ></TextInput>
      <Button
        title="Join"
        onPress={() => onJoin(roomId, username)}
        variant="primary"
        size="lg"
      />
    </View>
  );
};

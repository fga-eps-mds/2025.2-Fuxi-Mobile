import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface NavBarProps {
  onHomePress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export function NavBar({ onHomePress, onSearchPress, onProfilePress }: NavBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onHomePress}>
        <Feather name="home" size={26} color="#1D1D1D" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onSearchPress}>
        <Feather name="search" size={26} color="#1D1D1D" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onProfilePress}>
        <Feather name="user" size={26} color="#1D1D1D" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "rgba(29, 29, 29, 0.30)",
    borderWidth: 1,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // sombra Android
  },
});

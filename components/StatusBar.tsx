import React from "react";
import { StatusBar as RNStatusBar } from "react-native";

export default function StatusBar() {
  return (
    <RNStatusBar
      hidden={false}
      barStyle="dark-content"
      backgroundColor="#fff"
    />
  );
}

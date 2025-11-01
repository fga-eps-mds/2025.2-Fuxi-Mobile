import React from "react";
import { Text, View, StyleSheet, TextProps } from "react-native";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

export function AppText({ children, style, ...rest }: AppTextProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]} {...rest}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    // justifyContent: "center",
  },

  text: {
    color: "#1d1d1d",
    fontFamily: "Roboto", 
    fontSize: 17, 
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 17, 
  },
});
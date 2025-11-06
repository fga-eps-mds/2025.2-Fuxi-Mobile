import React from "react"
import { ScrollView, StyleSheet, TextProps, ScrollViewProps } from "react-native"

interface AppScrollViewProps extends ScrollViewProps{
  children: React.ReactNode
}

export function ViewContainer({children, style, ...rest}: AppScrollViewProps) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {children}
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  }
})
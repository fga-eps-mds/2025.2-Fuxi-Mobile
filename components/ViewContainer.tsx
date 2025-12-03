import React from "react"
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native"

interface AppScrollViewProps extends ScrollViewProps{
  children: React.ReactNode
}

export function ViewContainer({children, style, ...rest}: AppScrollViewProps) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, style]} {...rest}>
        {children}
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    position: "relative",
    // width: "100%",
    // height: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    // alignItems: "center",
    justifyContent: "center",
  }
})
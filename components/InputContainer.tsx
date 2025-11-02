import React from "react"
import { View, ViewProps, Text, StyleSheet } from "react-native"
import { AppText } from "@/components/AppText"

interface InputContainerProps extends ViewProps {
    label?: string,
    children: React.ReactNode
}

export function InputContainer({label, children, style, ...rest}: InputContainerProps) {
    return (
      <View style={styles.container}>
          {label && <AppText style={styles.label}>{label}</AppText>}
          {children}
      </View>
    )
}


const styles = StyleSheet.create({
    container:{
        width: "100%",
        marginBottom: 10,
    },
    label:{
        marginBottom: 8
    }
})
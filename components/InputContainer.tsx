import React from "react"
import { ScrollView, View, ViewProps, Text, StyleSheet } from "react-native"
import { DropdownSelect } from "@/components/DropdownSelect"
import { TextInputField } from "@/components/TextInputField"
import { PasswordInputField } from "@/components/PasswordInputField"
import { AppText } from "@/components/AppText"



interface InputContainerProps extends ViewProps {
    children: React.ReactNode
}

export function InputContainer({children, style, ...rest}: InputContainerProps) {
    return (
      <View style={styles.container}>
          {children}
      </View>
    )
}


const styles = StyleSheet.create({
    container:{
        width: "100%"
    }
})
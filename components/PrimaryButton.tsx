import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

interface PrimaryButtonProps {

    title: string
    color?: string
    onPress?: (event: GestureResponderEvent) => void

}

export function PrimaryButton({ title, color = "#003366", onPress }: PrimaryButtonProps) {
    return (
        <TouchableOpacity style = {[styles.button, {backgroundColor: color}]} onPress={onPress}>
            <Text style = {styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "80%",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 6
    },

    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    }
})
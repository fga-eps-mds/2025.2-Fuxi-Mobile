import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, TouchableOpacityProps, ViewStyle } from "react-native";
import { usePathname } from "expo-router";

interface PrimaryButtonProps {
    title: string
    color?: string
    disabled?: boolean
    onPress?: (event: GestureResponderEvent) => void
    style?: ViewStyle;
}

const authPaths = ["/auth/login", "/auth/register-company", "/auth/register-researcher", "/auth/register-collaborator"]

export function PrimaryButton({ title, disabled, color = "#003366", onPress, style }: PrimaryButtonProps) {
    const pathname = usePathname()

    const authStyle = (authPaths.includes(pathname)) ? { position: "absolute", bottom: 30 } : {} as any

    return (
        <TouchableOpacity style = {[styles.button, {backgroundColor: color}, authStyle, style]} disabled={disabled} onPress={onPress}>
            <Text style = {styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 14,
        marginVertical: 6,
    },

    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 17
    }
})
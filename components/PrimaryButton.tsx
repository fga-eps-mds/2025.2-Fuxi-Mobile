import { usePathname } from "expo-router";
import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import colors from "../theme/colors";

interface PrimaryButtonProps {
    title: string
    color?: string
    disabled?: boolean
    onPress?: (event: GestureResponderEvent) => void
    style?: ViewStyle;
}

const authPaths = ["/auth/login", "/auth/register-company", "/auth/register-researcher", "/auth/register-collaborator"]

export function PrimaryButton({ title, disabled, color = colors.primary, onPress, style }: PrimaryButtonProps) {
    const pathname = usePathname()

    const authStyle = (authPaths.includes(pathname)) ? { marginTop: 20 } : {} as any

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
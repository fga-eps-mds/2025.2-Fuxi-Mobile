import { StyleSheet, View, TouchableOpacity, TextInputProps } from "react-native";
import { useState} from "react";
import { TextInputField } from "@/components/TextInputField";
import { Feather } from "@expo/vector-icons";

interface PasswordInputFieldProps extends Omit<TextInputProps, "secureTextEntry"> {
    value: string;
    onChangeText: (text: string) => void,
    placeholder?: string;
}
    export function PasswordInputField({
    placeholder = "Minimo 8 caracteres",
    value,
    onChangeText,
    ...props 
}: PasswordInputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <TextInputField
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
                {...props}
            />
            <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                testID="password-visibility-toggle"
            >
                <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#989898"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
        position: "relative",
        width: '100%',
    },
    eyeButton: {
        position: "absolute",
        right: 12,
        top: 9,
    },
});

                
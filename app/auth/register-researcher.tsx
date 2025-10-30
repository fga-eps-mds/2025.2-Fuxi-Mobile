import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AppText } from "@/components/appText";
import { TextInputField } from "@/components/textInputField";

export default function RegisterResearcher() {
    const router = useRouter()

    return (

        <View>
            <AppText>Nome: </AppText>
            <TextInputField></TextInputField>

            <AppText>Sobrenome: </AppText>
            <TextInputField></TextInputField>

            <AppText>E-mail Institucional: </AppText>
            <TextInputField></TextInputField>

            <AppText>Senha: </AppText>
            <TextInputField></TextInputField>

            <AppText>Data de nascimento: </AppText>
            <TextInputField></TextInputField>

            <AppText>Câmpus: </AppText>
            <TextInputField></TextInputField>

        </View>
    )
}

// Terminar: background color e dropdown select

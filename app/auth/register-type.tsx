import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function RegisterType () {
    const router = useRouter()

    return (
        <View style = {styles.container}>
            <Image
                source={require("../../assets/images/vitra1-logo.png")}
                style={styles.logo}
                resizeMode = "contain"
            />

            <Text style = {styles.title}>Bem vindo!</Text>
            <Text style = {styles.subtitle}>Toda grande descoberta começou com uma pergunta simples.</Text>

            <PrimaryButton
            title = "Sou um pesquisador."
            onPress = {() => router.push("/auth/register-researcher")}
            />

            <PrimaryButton
            title = "Represento uma empresa."
            onPress = {() => router.push("/auth/register-company")}
            />

            <PrimaryButton
            title = "Sou um colaborador."
            onPress = {() => router.push("/auth/register-collaborator")}
            />

            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },

    logo: {
        width: 150,
        height: 150,
        marginBottom: 16,
  },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#003366",
  },
    subtitle: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginVertical: 12,
  },

})


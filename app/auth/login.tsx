import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AppText } from "@/components/appText";
import { TextInputField } from "@/components/textInputField";
import { Link } from "@react-navigation/native";
import { PasswordInputField } from "@/components/passwordInputField";


import { Feather } from "@expo/vector-icons";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        senha: "",
    });
    
    function handleLogin() {
        if (!form.email || !form.senha) {
            Alert.alert("Preencha todos os campos obrigatórios.");
            return;
        }

        Alert.alert("Sucesso!", "Login realizado com sucesso.");
        
        }

        function handleForgotPassword() {
            router.push("/reset-password");
        }
        
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={1}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                
                <ScrollView contentContainerStyle={styles.container}>

                    <View>
                        <Text style={styles.title}>Comece agora!</Text>
                        <Text style={styles.subtitle}>Informe seus dados para entrar na sua conta.</Text>
                    </View>

                    <AppText>E-mail</AppText>
                    <TextInputField
                        placeholder="exemplo@dominio.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                    />

                    <AppText>Senha</AppText>
                    <PasswordInputField
                        value={form.senha}
                        onChangeText={(text) => setForm({ ...form, senha: text })}                
                    />

                    {/*<Text style={styles.forgotPassword} onPress={handleForgotPassword}>Esqueceu a sua senha? Clique <Link to={{ screen: "/reset-password" }}>aqui</Link></Text>
                     */}                       
                    <PrimaryButton title="Entrar" onPress={handleLogin} />


                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
                
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#003366",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 17,
        color: "#555",
        marginVertical: 8,
        textAlign: "center",
    },
    forgotPassword: {
        alignSelf: "flex-end",
        color: "#003366",
        marginBottom: 20,
    },
});
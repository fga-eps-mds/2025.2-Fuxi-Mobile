import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AppText } from "@/components/AppText";
import { TextInputField } from "@/components/TextInputField";
import { DropdownSelect } from "@/components/DropdownSelect";
import { useState } from "react";
import { AuthContainer } from "@/components/AuthContainer";
import { validatePassword } from "@/utils/validatePassword";
import { validateCNPJ } from "@/utils/validateCNPJ";
import { validateEmail } from "@/utils/validateEmail";
import { formatCNPJ } from "@/utils/formatCNPJ";

export default function RegisterCompany() {
    const router = useRouter();

    const [form, setForm] = useState({

        nomeFantasia: "",
        cnpj: "",
        email: "",
        senha: "",
        porte: "",

    })

    const porteOptions = [

        { label: "MICROEMPRESA (ME)", value: "me"},
        { label: "MICROEMPREENDEDOR INDIVIDUAL", value: "me"},
        { label: "EMPRESA DE PEQUENO PORTE (EPP)", value: "epp"},
        { label: "EMPRESA DE MÉDIO PORTE", value: "grande"},
        { label: "EMPRESA DE GRANDE PORTE", value: "me"},

    ]

    function handleSubmit() {

        if(!form.nomeFantasia || !form.cnpj || !form.senha || !form.porte) {
            Alert.alert("Preencha todos os campos obrigatórios.");
            return;

        }

        if (!validateCNPJ(form.cnpj)) {
            return;
        }

        if (!validateEmail(form.email)) {
            return;
        }

        if (!validatePassword(form.senha)) {
            return;
        }

        Alert.alert("Sucesso!", "Cadastro validado com sucesso.");

    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={1}
        >
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <AuthContainer>
     
        <AppText>Nome Fantasia</AppText>
        <TextInputField
        placeholder="Nome da Empresa"
        value={form.nomeFantasia}
        onChangeText={(text) => setForm({ ...form, nomeFantasia: text })}
        />

        <AppText>CNPJ</AppText>
        <TextInputField
          placeholder="00.000.000/0000-00"
          keyboardType="numeric"
          value={form.cnpj}
          onChangeText={(text) => {
            const formatted = formatCNPJ(text);
            setForm({ ...form, cnpj: formatted });
          }}
        />

        <AppText>Email</AppText>
        <TextInputField
        placeholder="contato@empresa.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        />

        <AppText>Senha</AppText>
        <TextInputField
        placeholder="Mínimo 8 caracteres"
        secureTextEntry
        value={form.senha}
        onChangeText={(text) => setForm({ ...form, senha: text })}
        />
          
        <AppText>Porte</AppText>
        <DropdownSelect
        options={porteOptions}
        placeholder="Selecione o porte"
        value={form.porte}
        onSelect={(value) => setForm({ ...form, porte: value })}
        />

        <PrimaryButton title="Confirmar" onPress={handleSubmit} />
        </AuthContainer>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


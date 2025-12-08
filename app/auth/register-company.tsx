import { DropdownSelect } from "@/components/DropdownSelect";
import { InputContainer } from "@/components/InputContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextInputField } from "@/components/TextInputField";
import { ViewContainer } from "@/components/ViewContainer";
import { registerUser } from "@/services/authService";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { validateCNPJ } from "@/utils/validateCNPJ";
import { validateEmail } from "@/utils/validateEmail";
import { validatePassword } from "@/utils/validatePassword";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { PasswordInputField } from "@/components/PasswordInputField";

export default function RegisterCompany() {
    const router = useRouter();

    const [form, setForm] = useState({

        nomeFantasia: "",
        cnpj: "",
        email: "",
        senha: "",
        porte: "",

    })

    const [loading, setLoading] = useState(false);

    const porteOptions = [

        { label: "MICROEMPRESA (ME)", value: "MICROEMPRESA (ME)"},
        { label: "MICROEMPREENDEDOR INDIVIDUAL", value: "MICROEMPREENDEDOR INDIVIDUAL"},
        { label: "EMPRESA DE PEQUENO PORTE (EPP)", value: "EMPRESA DE PEQUENO PORTE (EPP)"},
        { label: "EMPRESA DE MÉDIO PORTE", value: "EMPRESA DE MÉDIO PORTE"},
        { label: "EMPRESA DE GRANDE PORTE", value: "EMPRESA DE GRANDE PORTE"},

    ]

    async function handleSubmit() {

        if(!form.nomeFantasia || !form.cnpj || !form.email || !form.senha || !form.porte) {
            Alert.alert("Preencha todos os campos obrigatórios.")
            return

        }

        if (!validateCNPJ(form.cnpj)) {
            return
        }

        if (!validateEmail(form.email)) {
            return
        }

        if (!validatePassword(form.senha)) {
            return
        }

        setLoading(true);
        try {
            await registerUser(form, "company")

            Alert.alert("Sucesso!", "Cadastro realizado com sucesso.");
            router.replace("/auth/login");
        } catch (error: any) {
            console.error(error.response?.data)
            
            const errorMsg = error.response?.data?.detail || "Não foi possível realizar o cadastro. Tente novamente mais tarde."
            Alert.alert("Erro no cadastro", errorMsg)
        } finally {
            setLoading(false)
        }

    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={1}
        >
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <ViewContainer>
     
        <InputContainer label="Nome Fantasia">
            <TextInputField
                placeholder="Nome da Empresa"
                value={form.nomeFantasia}
                onChangeText={(text) => setForm({ ...form, nomeFantasia: text })}
            />
        </InputContainer>
        

        <InputContainer label="CNPJ">
            <TextInputField
                placeholder="00.000.000/0000-00"
                keyboardType="numeric"
                value={form.cnpj}
                onChangeText={(text) => {
                    const formatted = formatCNPJ(text);
                    setForm({ ...form, cnpj: formatted });
                }}
            />
        </InputContainer>

        <InputContainer label="Email">
            <TextInputField
                placeholder="contato@empresa.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
            />
        </InputContainer>

        <InputContainer label="Senha">
              <PasswordInputField
                  value={form.senha}
                  onChangeText={(text) => setForm({ ...form, senha: text })}                
              />
          </InputContainer>

        <InputContainer label="Porte">
            <DropdownSelect
                options={porteOptions}
                placeholder="Selecione o porte"
                value={form.porte}
                onSelect={(value) => setForm({ ...form, porte: value })}
            />
        </InputContainer>
        

        <PrimaryButton
            title={loading ? "Confirmando..." : "Confirmar"}
            onPress={handleSubmit}
            disabled={loading}
          />

        </ViewContainer>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


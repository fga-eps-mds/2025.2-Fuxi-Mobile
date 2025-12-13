import { DropdownSelect } from "@/components/DropdownSelect";
import { InputContainer } from "@/components/InputContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextInputField } from "@/components/TextInputField";
import { PasswordInputField } from "@/components/PasswordInputField";
import { ViewContainer } from "@/components/ViewContainer";
import { registerUser } from "@/services/authService";
import { formatDate } from "@/utils/formatDate";
import { validateBirthDate } from "@/utils/validateBirthDate";
import { validatePassword } from "@/utils/validatePassword";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";

export default function RegisterResearcher() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    dataNascimento: "",
    senha: "",
    campus: "",
  });

  const [loading, setLoading] = useState(false);

  const campusOptions = [
    { label: "UNB DARCY RIBEIRO", value: "UNB DARCY RIBEIRO" },
    { label: "UNB GAMA: FCTE", value: "UNB GAMA: FCTE" },
    { label: "UNB PLANALTINA: FUP", value: "UNB PLANALTINA: FUP" },
    { label: "UNB CEILÂNDIA: FCE", value: "UNB CEILÂNDIA: FCE" },
  ];

  async function handleSubmit() {
    if (!form.nome || !form.sobrenome || !form.email || !form.senha || !form.campus) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!form.email.endsWith("@unb.br")) {
      Alert.alert("Use um e-mail institucional @unb.br.");
      return;
    }

    if (!validateBirthDate(form.dataNascimento)) {
      return;
    }

    if (!validatePassword(form.senha)) { 
    return;
  }

    setLoading(true);
    
    try {
        await registerUser(form, "researcher");
        Alert.alert("Sucesso!", "Cadastro realizado com sucesso.");
        
        router.replace("/auth/login");
    } catch (error: any) {
        console.log(error);
        const errorMsg = error.response?.data?.detail || "Não foi possível realizar o cadastro. Tente novamente mais tarde.";
        
        Alert.alert("Erro no cadastro", errorMsg);
    
    } finally {
        setLoading(false);
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
          <InputContainer label="Nome">
              <TextInputField
                placeholder="Seu nome"
                value={form.nome}
                onChangeText={(text) => setForm({ ...form, nome: text })}
              />
          </InputContainer>


          <InputContainer label="Sobrenome">
              <TextInputField
                placeholder="Seu sobrenome"
                value={form.sobrenome}
                onChangeText={(text) => setForm({ ...form, sobrenome: text })}
              />
          </InputContainer>


          <InputContainer label="Email institucional">
              <TextInputField
                placeholder="exemplo@unb.br"
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

          <InputContainer label="Data de nascimento">
              <TextInputField
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={form.dataNascimento}
                onChangeText={(text) => {
                  const formatted = formatDate(text);
                  setForm({ ...form, dataNascimento: formatted });
                }}
              />
          </InputContainer>


          <InputContainer label="Câmpus">
              <DropdownSelect
                options={campusOptions}
                placeholder="Selecione seu câmpus"
                value={form.campus}
                onSelect={(value) => setForm({ ...form, campus: value })}
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


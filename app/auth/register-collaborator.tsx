import { DropdownSelect } from "@/components/DropdownSelect";
import { InputContainer } from "@/components/InputContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextInputField } from "@/components/TextInputField";
import { ViewContainer } from "@/components/ViewContainer";
import { registerUser } from "@/services/authService";
import { formatDate } from "@/utils/formatDate";
import { validateBirthDate } from "@/utils/validateBirthDate";
import { validateEmail } from "@/utils/validateEmail";
import { validatePassword } from "@/utils/validatePassword";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { PasswordInputField } from "@/components/PasswordInputField";

export default function RegisterCollaborator() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    dataNascimento: "",
    senha: "",
    categoria: "",
  });

  const [loading, setLoading] = useState(false);

  const categoriaOptions = [
    { label: "DISCENTE", value: "DISCENTE" },
    { label: "SERVIDOR", value: "SERVIDOR" },
    { label: "EXTERNO", value: "EXTERNO" },

  ];

  async function handleSubmit() {
    if (!form.nome || !form.sobrenome || !form.email || !form.dataNascimento || !form.senha || !form.categoria) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!validateEmail(form.email)) {
        return
    }

    if (!validateBirthDate(form.dataNascimento)) {
      return;
    }

    if (!validatePassword(form.senha)) {
    return;
  }
    setLoading(true);
    try{ 
        await registerUser(form, "collaborator")

        Alert.alert("Sucesso!", "Cadastro realizado com sucesso.")
        router.push("/auth/login")
    } catch (error: any) {
        console.error(error)
        const errorMsg = error.response?.data?.detail || "Não foi possível realizar o cadastro. Tente novamente mais tarde."
        Alert.alert("Erro no cadastro", errorMsg)
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

          
          <InputContainer label="Email">
              <TextInputField
                placeholder="exemplo@dominio.br"
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

          <InputContainer label="Categoria">
              <DropdownSelect
                options={categoriaOptions}
                placeholder="Selecione sua categoria"
                value={form.categoria}
                onSelect={(value) => setForm({ ...form, categoria: value })}
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


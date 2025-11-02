import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AppText } from "@/components/AppText";
import { TextInputField } from "@/components/TextInputField";
import { DropdownSelect } from "@/components/DropdownSelect";
import { AuthContainer } from "@/components/AuthContainer";
import { InputContainer } from "@/components/InputContainer";
import { validateBirthDate } from "@/utils/validateBirthDate";
import { validatePassword } from "@/utils/validatePassword";
import { formatDate } from "@/utils/formatDate";

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

  const campusOptions = [
    { label: "UNB DARCY RIBEIRO", value: "darcy" },
    { label: "UNB GAMA: FCTE", value: "fga" },
    { label: "UNB PLANALTINA: FUP", value: "fup" },
    { label: "UNB CEILÂNDIA: FCE", value: "fce" },
  ];

  function handleSubmit() {
    if (!form.nome || !form.sobrenome || !form.email || !form.senha) {
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
              <TextInputField
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
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
          

          <PrimaryButton title="Confirmar" onPress={handleSubmit} />
        </AuthContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


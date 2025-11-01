import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AppText } from "@/components/AppText";
import { TextInputField } from "@/components/TextInputField";
import { DropdownSelect } from "@/components/DropdownSelect";
import { AuthContainer } from "@/components/AuthContainer";
import { validateBirthDate } from "@/utils/validateBirthDate";
import { validatePassword } from "@/utils/validatePassword";
import { validateEmail } from "@/utils/validateEmail";
import { formatDate } from "@/utils/formatDate";

export default function RegisterResearcher() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    dataNascimento: "",
    senha: "",
    categoria: "",
  });

  const categoriaOptions = [
    { label: "DISCENTE", value: "dis" },
    { label: "SERVIDOR", value: "serv" },
    { label: "EXTERNO", value: "ext" },

  ];

  function handleSubmit() {
    if (!form.nome || !form.sobrenome || !form.email || !form.senha || !form.categoria) {
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
          <AppText>Nome</AppText>
          <TextInputField
            placeholder="Seu nome"
            value={form.nome}
            onChangeText={(text) => setForm({ ...form, nome: text })}
          />

          <AppText>Sobrenome</AppText>
          <TextInputField
            placeholder="Seu sobrenome"
            value={form.sobrenome}
            onChangeText={(text) => setForm({ ...form, sobrenome: text })}
          />

          <AppText>Email</AppText>
          <TextInputField
            placeholder="exemplo@dominio.br"
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

          <AppText>Data de nascimento</AppText>
          <TextInputField
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={form.dataNascimento}
            onChangeText={(text) => {
              const formatted = formatDate(text);
              setForm({ ...form, dataNascimento: formatted });
            }}
          />

          <AppText>Categoria</AppText>
          <DropdownSelect
            options={categoriaOptions}
            placeholder="Selecione sua categoria"
            value={form.categoria}
            onSelect={(value) => setForm({ ...form, categoria: value })}
          />

          <PrimaryButton title="Confirmar" onPress={handleSubmit} />
        </AuthContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


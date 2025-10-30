import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AppText } from "@/components/appText";
import { TextInputField } from "@/components/textInputField";
import { DropdownSelect } from "@/components/dropdownSelect";
import { validateBirthDate } from "@/utils/validateBirthDate";
import { validatePassword } from "@/utils/validatePassword";
import { validateEmail } from "@/utils/validateEmail";

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
        <ScrollView contentContainerStyle={styles.container}>
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
            value={form.dataNascimento}
            onChangeText={(text) => setForm({ ...form, dataNascimento: text })}
          />

          <AppText>Categoria</AppText>
          <DropdownSelect
            options={categoriaOptions}
            placeholder="Selecione sua categoria"
            value={form.categoria}
            onSelect={(value) => setForm({ ...form, categoria: value })}
          />

          <PrimaryButton title="Confirmar" onPress={handleSubmit} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
});
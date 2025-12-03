import { DropdownSelect } from '@/components/DropdownSelect';
import { InputContainer } from '@/components/InputContainer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextAreaInputField } from '@/components/TextAreaInputField';
import { TextInputField } from '@/components/TextInputField';
import { ViewContainer } from '@/components/ViewContainer';
import { createResearch } from '@/services/researchService';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import colors from "@/theme/colors";



export default function CreateResearch() {
    const router = useRouter();

    // Gerenciamento de palavras-chave
    const [keywords, setKeywords] = useState<string[]>([]);
    const [text, setText] = useState("");

    // Adiciona palavra-chave quando o usuário pressiona Enter
    const handleAddKeyword = () => {
      const trimmed = text.trim();
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setText("");
    };

    // Remove uma palavra-chave
    const handleRemoveKeyword = (word: any) => {
      setKeywords(keywords.filter((k) => k !== word));
    };
    
    const [form, setForm] = useState<any>({
      title: "",
      knowledge_area: "",
      keywords: [],
      status: "",
      campus: "",
      description: "",
    });
  
    const [loading, setLoading] = useState(false);
  
    const campusOptions = [
      { label: "UNB DARCY RIBEIRO", value: "UNB DARCY RIBEIRO" },
      { label: "UNB GAMA: FCTE", value: "UNB GAMA: FCTE"},
      { label: "UNB PLANALTINA: FUP", value: "UNB PLANALTINA: FUP" },
      { label: "UNB CEILÂNDIA: FCE", value: "UNB CEILÂNDIA: FCE" },  
    ];
    const statusOptions = [
      { label: "RASCUNHO", value: "RASCUNHO" },
      { label: "EM ANÁLISE", value: "EM ANÁLISE" },
      { label: "APROVADO", value: "APROVADO" },
      { label: "EM ANDAMENTO", value: "EM ANDAMENTO" },
      { label: "CONCLUÍDO", value: "CONCLUÍDO" },
      { label: "CANCELADO", value: "CANCELADO" },
    ];

  
    async function handleSubmit() {
      if (Object.values(form).some(value => !value)) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }
  
      setLoading(true);
      try{ 
          form.keywords = keywords
          const createResponse = await createResearch(form)
          console.log(createResponse);

          setForm({
            title: "",
            knowledge_area: "",
            keywords: [],
            status: "",
            campus: "",
            description: "",
          })

          setKeywords([])

  
          Alert.alert("Sucesso!", "Projeto criado com sucesso.")
          router.push("/tabs/home")
      } catch (error: any) {
          console.error(error)
          console.log('Erro detalhado:', JSON.stringify(error, null, 2));
          const errorMsg = error.response?.data?.detail || "Não foi possível criar o projeto. Tente novamente mais tarde."
          Alert.alert("Erro na criação", errorMsg)
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
          <Text style={styles.title}>Novo Projeto:</Text>
          <InputContainer label="Título:">
              <TextInputField
                placeholder="Título"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
              />
          </InputContainer>
          
          <InputContainer label="Descrição:">
              <TextAreaInputField
                placeholder="Descrição"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />
          </InputContainer>

          <InputContainer label="Área de conhecimento:">
              <TextInputField
                placeholder="Área de conhecimento"
                value={form.knowledge_area}
                onChangeText={(text) => setForm({ ...form, knowledge_area: text })}
              />
          </InputContainer>

          
          <InputContainer label="Palavras chave:">
                <TextInputField
                  placeholder="Digite uma palavra chave"
                  // placeholderTextColor="#007BFF"
                  value={text}
                  onChangeText={setText}
                  onSubmitEditing={handleAddKeyword}
                  returnKeyType="done"
                />

                {keywords.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {keywords.map((item, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{item}</Text>
                        <TouchableOpacity onPress={() => handleRemoveKeyword(item)}>
                          <Ionicons name="close-outline" size={18} color="#666" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </InputContainer>


          <InputContainer label="Status">
              <DropdownSelect
                options={statusOptions}
                placeholder="Selecione um status"
                value={form.status}
                onSelect={(value) => setForm({ ...form, status: value })}
              />
          </InputContainer>

          <InputContainer label="Campus">
              <DropdownSelect
                options={campusOptions}
                placeholder="Selecione um campus"
                value={form.campus}
                onSelect={(value) => setForm({ ...form, campus: value })}
              />
          </InputContainer>

          <PrimaryButton
            title={loading ? "Criando..." : "Criar"}
            onPress={handleSubmit}
            disabled={loading}
          />
          
        </ViewContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "800",
    marginEnd: "auto",
    marginBottom: 15,
    color: colors.primary,
    fontFamily: "Roboto",
  },

    container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: "#F5F8FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E6F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    fontSize: 15,
    color: "#007BFF",
    paddingVertical: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
    borderWidth: 1,
    borderColor: "#E2E6EB",
  },
  tagText: {
    marginRight: 6,
    color: "#333",
  },
})
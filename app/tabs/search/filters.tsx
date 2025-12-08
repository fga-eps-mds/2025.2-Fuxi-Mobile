import colors from "@/theme/colors";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
  Alert
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchFilters {
  pesquisador?: string;
  keywords?: string[];
  campus?: string;
  area?: string;
  situacao?: string;
}

const STORAGE_KEY_FILTERS = "searchFilters";


export default function FiltersScreen() {
  const [pesquisador, setPesquisador] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [campus, setCampus] = useState("");
  const [area, setArea] = useState("");
  const [situacao, setSituacao] = useState("");
  const [text, setText] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState<null | string>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const storedFilters = await AsyncStorage.getItem(STORAGE_KEY_FILTERS);
        if (storedFilters) {
          const parsedFilters: SearchFilters = JSON.parse(storedFilters);
          setPesquisador(parsedFilters.pesquisador || "");
          setKeywords(parsedFilters.keywords || []);
          setCampus(parsedFilters.campus || "");
          setArea(parsedFilters.area || "");
          setSituacao(parsedFilters.situacao || "");
        }
      } catch (error) {
        console.error("Failed to load filters from AsyncStorage", error);
      }
    };
    loadFilters();
  }, []);

  const dropdownOptions = {
    campus: ["UNB DARCY RIBEIRO", "UNB GAMA: FCTE", "UNB PLANALTINA: FUP", "UNB CEILÂNDIA: FCE"],
    situacao: [ "RASCUNHO", "EM ANÁLISE", "APROVADO", "EM ANDAMENTO", "CONCLUÍDO", "CANCELADO"]
  };

  const appliedFiltersCount = [
    pesquisador,
    keywords,
    campus,
    area,
    situacao
  ].filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    return Boolean(v && v !== "");
  }).length;

  const resetAll = async () => {
    setPesquisador("");
    setKeywords([]);
    setCampus("");
    setArea("");
    setSituacao("");
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_FILTERS);
    } catch (error) {
      console.error("Failed to remove filters from AsyncStorage", error);
    }
  };
 
  const handleCloseFilters = () =>{
      router.push(`/tabs/search`);
  }

  const handleAddKeyword = () => {
      const trimmed = text.trim();
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setText("");
  };

  const handleRemoveKeyword = (word: any) => {
    setKeywords(keywords.filter((k) => k !== word));
  };

    const handleSearch = async ()=>{
      if (appliedFiltersCount === 0) {
        Alert.alert("Nenhum filtro foi utilizado!")
        return
      }
      const currentFilters: SearchFilters = {
        pesquisador,
        keywords,
        campus,
        area,
        situacao
      };
      try {
        await AsyncStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(currentFilters));
      } catch (error) {
        console.error("Failed to save filters to AsyncStorage", error);
      }
      router.push(`/tabs/search`);
    }
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.filterTitle}>Filter by:</Text>
        <TouchableOpacity onPress={handleCloseFilters}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.resetAllBtn} onPress={resetAll}>
          <Text style={styles.resetAllText}>Limpar Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} onPress={handleSearch}>
          <Text style={styles.applyText}>
            Aplicar Filtros ({appliedFiltersCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {/* Campo Pesquisador */}
        <FieldLabel
          label="Pesquisador"
          onReset={() => setPesquisador("")}
        />
        <TextInput
          style={styles.input}
          value={pesquisador}
          placeholder="Digite o nome"
          onChangeText={setPesquisador}
        />

        {/* Palavras-chave */}
        <FieldLabel
          label="Palavras-chave"
          onReset={() => setKeywords([])}
        />
        <TextInput
          style={styles.input}
          value={text}
          placeholder="Digite uma palavra-chave"
          onChangeText={setText}
          onSubmitEditing={handleAddKeyword}
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

        {/* Área de conhecimento */}
        <FieldLabel
          label="Área de conhecimento"
          onReset={() => setArea("")}
        />
        <TextInput
          style={styles.input}
          value={area}
          placeholder="Digite palavras-chave"
          onChangeText={setArea}
        />

        {/* Dropdown Campus */}
        <DropdownField
          label="Campus"
          value={campus}
          onPress={() => setDropdownVisible("campus")}
          onReset={() => setCampus("")}
        />

        {/* Dropdown Situação */}
        <DropdownField
          label="Status"
          value={situacao}
          onPress={() => setDropdownVisible("situacao")}
          onReset={() => setSituacao("")}
        />
      </ScrollView>

      {/* Modal Dropdown */}
      <Modal visible={dropdownVisible !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <FlatList
              data={dropdownVisible ? dropdownOptions[dropdownVisible as keyof typeof dropdownOptions] : []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    if (dropdownVisible === "campus") setCampus(item);
                    if (dropdownVisible === "area") setArea(item);
                    if (dropdownVisible === "situacao") setSituacao(item);
                    setDropdownVisible(null);
                  }}
                >
                  <Text>{item}</Text>
                </Pressable>
              )}
            />

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setDropdownVisible(null)}
            >
              <Text style={{ color: colors.primary }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FieldLabel({ label, onReset }: any) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onReset}>
        <Text style={styles.resetText}>Limpar</Text>
      </TouchableOpacity>
    </View>
  );
}

function DropdownField({ label, value, onPress, onReset }: any) {
  return (
    <>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onReset}>
          <Text style={styles.resetText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={styles.dropdownText}>{value || "Selecionar"}</Text>
        <Feather name="chevron-down" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 16,
    backgroundColor: "#fff",
    flex: 1
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  filterTitle: {
    fontSize: 14,
    color: "#777"
  },
  closeIcon: {
    fontSize: 20,
    color: "#777"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15
  },
  resetAllBtn: {
    flex: 1,
    backgroundColor: "#E6F4FE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  resetAllText: {
    color: colors.primary,
    fontWeight: "600"
  },
  applyBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  applyText: {
    color: "#fff",
    fontWeight: "700"
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18
  },
  label: {
    fontSize: 16,

  },
  resetText: {
    color: colors.primary
  },
  input: {
    fontSize: 15,
    backgroundColor: "#f5f8ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 6
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: "#f5f8ff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 15,
    color: "#555"
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#777"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  modalClose: {
    padding: 12,
    alignItems: "center"
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
});

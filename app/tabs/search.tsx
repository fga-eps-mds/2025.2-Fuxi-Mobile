import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Carregar histórico salvo
  useEffect(() => {
    const loadSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem("recentSearches");
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.log("Erro ao carregar histórico:", error);
      }
    };
    loadSearches();
  }, []);

  // Salvar histórico no AsyncStorage
  const saveSearches = async (newSearches: string[]) => {
    try {
      await AsyncStorage.setItem("recentSearches", JSON.stringify(newSearches));
    } catch (error) {
      console.log("Erro ao salvar histórico:", error);
    }
  };

  // Quando o usuário envia uma pesquisa
  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const newList = [searchText, ...recentSearches.filter(item => item !== searchText)].slice(0, 5);
    setRecentSearches(newList);
    saveSearches(newList);
    setSearchText("");
    Keyboard.dismiss();
  };

  // Remover uma pesquisa específica
  const handleRemove = (item: string) => {
    const filtered = recentSearches.filter(search => search !== item);
    setRecentSearches(filtered);
    saveSearches(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Explore projetos existentes..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => alert("Abrir filtros avançados")}>
          <Ionicons name="filter-outline" size={20} color="#444" />
        </TouchableOpacity>
      </View>

      {/* Pesquisas recentes */}
      {recentSearches.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.title}>Pesquisas recentes:</Text>

          <View style={styles.recentBox}>
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.recentItem}>
                  <Ionicons name="search-outline" size={18} color="#666" />
                  <Text numberOfLines={1} style={styles.recentText}>
                    {item}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemove(item)}>
                    <Ionicons name="close-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#333",
  },
  filterButton: {
    padding: 5,
  },
  recentContainer: {
    marginTop: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
  },
  recentBox: {
    backgroundColor: "#EAF0FA",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  recentText: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
    fontWeight: "500",
  },
});


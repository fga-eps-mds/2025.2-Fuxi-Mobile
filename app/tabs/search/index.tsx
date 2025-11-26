import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ResearchCard } from "@/components/ResearchCard";
import { searchResearches } from "@/services/researchService";
import colors from "@/theme/colors";
import { ResearchData } from "../home";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

interface SearchFilters {
  pesquisador?: string;
  keywords?: string[];
  campus?: string;
  area?: string;
  situacao?: string;
}

const STORAGE_KEY_FILTERS = "searchFilters";




export default function SearchScreen() {
    const [searchText, setSearchText] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<ResearchData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  
    // Quando a pesquisa é feita com filtros
    const fetchResearches = useCallback(async (filters: SearchFilters, searchTxt?: string) => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchResearches({
          knowledgeArea: filters.area,
          keywords: filters.keywords,
          researcherName: filters.pesquisador,
          campus: filters.campus,
          status: filters.situacao,
          title: searchTxt || undefined, // Add title for combined search
        });
        setSearchResults(results);
      } catch (err) {
        console.log(err);
        setError("Erro ao buscar resultados.");
      } finally {
        setLoading(false);
      }
    }, []);
  
    useFocusEffect(
      useCallback(() => {
        const loadAndApplyFilters = async () => {
          try {
            const storedFilters = await AsyncStorage.getItem(STORAGE_KEY_FILTERS);
            if (storedFilters) {
              const parsedFilters: SearchFilters = JSON.parse(storedFilters);
              setActiveFilters(parsedFilters);
              fetchResearches(parsedFilters, searchText); // Apply filters and current search text
            } else {
              setActiveFilters({});
              fetchResearches({}); // No filters, fetch all or default
            }
          } catch (error) {
            console.error("Failed to load filters from AsyncStorage", error);
            setActiveFilters({});
            fetchResearches({}); // Fallback to no filters
          }
        };
        loadAndApplyFilters();
      }, [fetchResearches])
    );


  // Salvar histórico no AsyncStorage
  const saveSearches = async (newSearches: string[]) => {
    try {
      await AsyncStorage.setItem("recentSearches", JSON.stringify(newSearches));
    } catch (error) {
      console.log("Erro ao salvar histórico:", error);
    }
  };

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

  // Quando o usuário envia uma pesquisa
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchResearches(activeFilters, searchText);
    } catch (err) {
      console.log(err);
      setError("Erro ao buscar resultados.");
    } finally {
      setLoading(false);
    }

    if (searchText.trim() !== ""){
      const newList = [searchText, ...recentSearches.filter(item => item !== searchText)].slice(0, 5);
      setRecentSearches(newList);
      saveSearches(newList);
    }
    Keyboard.dismiss();
  };

  // Remover uma pesquisa específica
  const handleRemove = (item: string) => {
    const filtered = recentSearches.filter(search => search !== item);
    setRecentSearches(filtered);
    saveSearches(filtered);
  };
  
  const handlePress = (id: number) => {
    router.push(`/tabs/home/project?id=${id}`);
};
  const handleFilters = () =>{
    router.push(`/tabs/search/filters`);
    setSearchText(""); // Clear search text when navigating to filters
  }


  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#808080" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Explore projetos existentes..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.filterButton} onPress={handleFilters}>
          <Feather name="filter" size={20} color="#808080" />
        </TouchableOpacity>
      </View>

      {/* Resultados da pesquisa */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ResearchCard research={item} onPress={() => handlePress(item.id)} />}
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.recentContainer}>
          <Text style={styles.title}>Pesquisas recentes:</Text>
          {recentSearches.length > 0 && (
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
          )}
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
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    paddingRight: 10,
    paddingLeft: 10,
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
    color: colors.primary,
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
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.danger,
    fontSize: 16,
  },
});


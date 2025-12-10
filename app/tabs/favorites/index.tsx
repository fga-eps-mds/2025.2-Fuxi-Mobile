import { AppText } from '@/components/AppText';
import { ResearchCard } from '@/components/ResearchCard';
import { getFavorites } from '@/services/researchService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from "../../../theme/colors";
import { useRouter } from 'expo-router';

export interface ResearchData {
  id: number;
  researcher: number;
  members: string[]
  createdDate?: string;
  title: string;
  description: string;
  status: string;
  knowledge_area: string;
  keywords: string[];
  campus: string;
  sponsoring_company: number;
}

export default function Favorites() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<ResearchData[]>([]);
  
  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
        const favorites = await getFavorites(); 
        setFavorites(favorites);
    } catch (e) {
        setError("Não foi possível carregar os favoritos. Tente novamente.");
        setFavorites([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };


  const handleCardPress = (id: number) => {
    router.push(`/tabs/home/project?id=${id}`); 
  };
  
  const Section: React.FC<{ title: string; list: ResearchData[] }> = ({ title, list }) => {
    if (list.length === 0) {
        return (
            <View style={styles.sectionContainer}>
                <AppText style={styles.sectionTitle}>{title}:</AppText>
                <Text style={styles.noDataText}>Nenhuma informação encontrada nesta seção.</Text>
            </View>
        );
    }

    return (
        <View style={styles.sectionContainer}>
            <AppText style={styles.sectionTitle}>{title}:</AppText>
            {list.map(research => (
                <ResearchCard 
                    key={research.id} 
                    research={research} 
                    onPress={handleCardPress} 
                />
            ))}
        </View>
    );
  };

  const renderContent = () => {
    if (loading) {
        return (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: '#666' }}>Carregando painel...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchFavorites} style={styles.retryButton}>
                     <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Conteúdo do pesquisador: 3 seções.
    return (
        <>
            <Section title="Meus favoritos" list={favorites} />
        </>
    );
  };

  return (
    <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}       refreshControl={    //Pensando em trocar para FlatList se ficar pesado - Pedro
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
            <View style={styles.listArea}>
                 {renderContent()}
            </View>
           
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 30, 
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003A7A',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    searchContainer: {
        marginBottom: 20,
    },
    listArea: {
        flex: 1,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#003A7A',
        marginBottom: 10,
    },
    feedbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        minHeight: 150,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    noDataText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 10,
    },
    retryButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#003A7A',
        borderRadius: 5,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
});
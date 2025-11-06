import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
 
import { AppText } from '@/components/AppText'; 
import { ResearchCard } from '@/components/ResearchCard';
import { SearchBar } from '@/components/SearchBar'; 

interface Research {
  id: string;
  title: string;
  researcherName: string; 
  description: string;
  budget: string;
}

// Mock de dados
const mockResearches: Research[] = [
    { id: '', title: '', researcherName: '', description: 'Descrição da pesquisa 1', budget: '' },
    { id: '', title: '', researcherName: '', description: 'Descrição da pesquisa 2', budget: '' },
    { id: '', title: '', researcherName: '', description: 'Descrição da pesquisa 3', budget: '' },
];

interface ResearcherData {
    favorites: Research[];
    recents: Research[];
    myProjects: Research[];
    campus: string; 
    name: string;
}


export default function ResearcherHome() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResearcherData>({
      favorites: [],
      recents: [],
      myProjects: [],
      campus: 'Darcy Ribeiro', 
      name: 'João Silva', 
  });

  const [searchText, setSearchText] = useState('');
  
  // Função que SIMULA a busca de pesquisas (MOCK) para todas as seções.
  const fetchResearcherDataMock = async () => {
    setLoading(true);
    setError(null);

    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setData({
            favorites: mockResearches.slice(0, 2),
            recents: mockResearches,
            myProjects: mockResearches.slice(0, 1),
            campus: 'Darcy Ribeiro',
            name: 'João Silva',
        });

    } catch (e) {
        setError("Não foi possível carregar os dados. Tente novamente.");
        setData(prev => ({ ...prev, favorites: [], recents: [], myProjects: [] }));
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearcherDataMock();
  }, []);

//   const handleCardPress = (id: string) => {
//     // Redireciona para a tela de Detalhes
//     router.push(`/research/${id}`); 
//   };
  
  // Componente para renderizar uma seção (Meus Favoritos, Mais Recentes, etc.)
  const Section: React.FC<{ title: string; list: Research[] }> = ({ title, list }) => {
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
                <ActivityIndicator size="large" color="#003366" />
                <Text style={{ marginTop: 10, color: '#666' }}>Carregando painel...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchResearcherDataMock} style={styles.retryButton}>
                     <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Conteúdo do pesquisador: 3 seções.
    return (
        <>
            <Section title="Meus favoritos" list={data.favorites} />
            <Section title="Mais recentes" list={data.recents} />
            <Section title="Meus projetos" list={data.myProjects} /> 
        </>
    );
  };


  return (
    <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Olá Pesquisador, {data.name}</Text>
                <Text style={styles.subtitle}>{data.campus}</Text>
                {/* Ícone de notificação aqui. */}
            </View>
        
            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Explore projetos existentes..."
                />
            </View>

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
        color: '#003366',
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
        color: '#003366',
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
        backgroundColor: '#003366',
        borderRadius: 5,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
});
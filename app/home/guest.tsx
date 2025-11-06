import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { TextInputField } from '@/components/TextInputField'; 
import { AppText } from '@/components/AppText'; 
import { ResearchCard } from '@/components/ResearchCard'; 

interface Research {
  id: string;
  title: string; 
  researcherName: string; 
  description: string;
  budget: string; 
}

const mockResearches: Research[] = [
    { id: '1', title: 'Algoritmos Quânticos', researcherName: 'João Silva', description: 'Descrição da pesquisa 1', budget: '20.000,00' },
    { id: '2', title: 'Sistemas Sustentáveis', researcherName: 'Ana Costa', description: 'Descrição da pesquisa 2', budget: '15.500,00' },
    { id: '3', title: 'IA em Educação', researcherName: 'Carlos Oliveira', description: 'Descrição da pesquisa 3', budget: '30.000,00' },
    { id: '4', title: 'Como lavar dinheiro em 2025', researcherName: 'Bruno Souza', description: 'É muito legal rapaziada', budget: '00,00'},
]

export default function GuestHome() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [researches, setResearches] = useState<Research[]>([]); 

  const [searchText, setSearchText] = useState('');
  
  // Função que SIMULA a busca de pesquisas (MOCK)
  const fetchResearchesMock = async () => {
    setLoading(true)
    setError(null)

    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setResearches(mockResearches);
    } catch (e) {
        setError("Não foi possível carregar as pesquisas. Verifique sua conexão.");
        setResearches([]); 
    } finally {
        setLoading(false); 
    }
  };

  useEffect(() => {
    fetchResearchesMock();
  }, []);


  const handleCardPress = (id: string) => {
    // Redireciona para a tela de "Detalhes da Pesquisa", passando o ID
    router.push({
        pathname: "/research/details", 
        params: { id: id }
    }); 
  };
  
  // Renderização Condicional do Conteúdo Principal.
  const renderContent = () => {
    if (loading) {
        return (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator size="large" color="#d409c3ff" />
                <Text style={{ marginTop: 10, color: '#666' }}>Buscando pesquisas...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchResearchesMock} style={styles.retryButton}>
                     <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (researches.length === 0) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.noDataText}>Nenhuma pesquisa encontrada.</Text>
            </View>
        );
    }
    
    return (
        <>
            <AppText style={styles.sectionTitle}>Mais recentes:</AppText>
            {researches.map(research => (
                <ResearchCard 
                    key={research.id} 
                    research={research} 
                    onPress={handleCardPress} 
                />
            ))}
        </>
    );
  };


  return (
    <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            
            <View style={styles.header}>
                <Text style={styles.greeting}>Olá Convidado,</Text>
                <Text style={styles.subtitle}>Entre com a sua conta para ter acesso a mais funções.</Text>
            </View>
            
            <View style={styles.searchContainer}>
                <TextInputField
                    placeholder="Explore projetos existentes..."
                    value={searchText}
                    onChangeText={setSearchText}
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
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
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
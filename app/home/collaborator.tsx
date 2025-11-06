import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { TextInputField } from '@/components/TextInputField'; 
import { AppText } from '@/components/AppText'; 
import { ResearchCard } from '@/components/ResearchCard'; 
import { Bell } from 'lucide-react-native'; // Ícone de sino para notificação.

interface Research {
  id: string;
  title: string;
  researcherName: string; 
  description: string;
  budget: string;
}


const mockResearches: Research[] = [
    { id: '4', title: 'Aprendizado de Máquina', researcherName: 'Dr. Lucas Pereira', description: 'Descrição da pesquisa 4', budget: '25.000,00' },
    { id: '5', title: 'Análise de Dados Ambientais', researcherName: 'Dra. Sofia Lima', description: 'Descrição da pesquisa 5', budget: '18.000,00' },
    { id: '6', title: 'Modelagem de Sistemas', researcherName: 'Prof. Marcos Souza', description: 'Descrição da pesquisa 6', budget: '12.000,00' },
];

interface CollaboratorData {
    favorites: Research[];
    recents: Research[];
    category: string;
    name: string;
}


export default function CollaboratorHome() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CollaboratorData>({
      favorites: [],
      recents: [],
      category: 'Estudante de Pós-Graduação',
      name: 'Maria Antônia', 
  });

  const [searchText, setSearchText] = useState('');
  
  const fetchCollaboratorDataMock = async () => {
    setLoading(true);
    setError(null);

    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setData({
            favorites: mockResearches.slice(0, 1),
            recents: mockResearches,
            category: 'Estudante de Pós-Graduação',
            name: 'Maria Antônia',
        });

    } catch (e) {
        setError("Não foi possível carregar os dados do Colaborador. Tente novamente.");
        setData(prev => ({ ...prev, favorites: [], recents: [] }));
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboratorDataMock();
  }, []);

  // Função de Redirecionamento (Simulação)
  const handleCardPress = (id: string) => {
    Alert.alert("Navegação Simulada", `Redirecionando para Detalhes da Pesquisa com ID: ${id}`);
  };
  
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
                <TouchableOpacity onPress={fetchCollaboratorDataMock} style={styles.retryButton}>
                     <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    // Conteúdo do Colaborador: 2 Seções.
    return (
        <>
            <Section title="Meus favoritos" list={data.favorites} />
            <Section title="Mais recentes" list={data.recents} />
        </>
    );
  };


  return (
    <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá Colaborador, {data.name}</Text>
                    <Text style={styles.subtitle}>{data.category}</Text>
                </View>
                {/* Ícone de notificação. */}
                <Bell color="#003366" size={24} /> 
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
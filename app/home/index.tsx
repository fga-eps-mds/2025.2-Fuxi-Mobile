import { AppText } from '@/components/AppText';
import { ResearchCard } from '@/components/ResearchCard';
import { getProfile, logoutUser } from '@/services/authService';
import { getMyResearches, getResearches } from '@/services/researchService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export interface UserData {
  id: number;
  email: string;
  user_type: 'researcher' | 'collaborator' | 'company';
  is_authenticated: boolean;
  profile: {
    id: number;
    firstName?: string;
    surname?: string;
    birthDate?: string; // formato ISO (ex: "2000-01-01")
    campus?: string;
    category?: string;
    cnpj?: string;
    fantasyName?: string;
    size?: string;
  };
  researches?: ResearchData[]
}

export interface ResearchData {
  id: number;
  researcher: number;
  author: string
  createdDate: string; // formato ISO (ex: "2025-11-07")
  title: string;
  description: string;
  status: string;
  knowledge_area: string;
  keywords: string[];
  campus: string;
}

export default function ResearcherHome() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null)
  const [researches, setResearches] = useState<ResearchData[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
        let user: UserData | null = null
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
           user = await getProfile()
        }

        const researches = await getResearches(); 

        if (user && user.user_type === "researcher"){
          user.researches = await getMyResearches();
        }
        
        setUserData(user);
        setResearches(researches);

    } catch (e) {
        setError("Não foi possível carregar os dados. Tente novamente.");
        setResearches([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCardPress = (id: string) => {
    // Redireciona para a tela de Detalhes
    // router.push(`/research/${id}`); 
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
                <ActivityIndicator size="large" color="#003366" />
                <Text style={{ marginTop: 10, color: '#666' }}>Carregando painel...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchUserData} style={styles.retryButton}>
                     <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Conteúdo do pesquisador: 3 seções.
    return (
        <>
            {/* <Section title="Meus favoritos" list={data.favorites} /> */}
            <Section title="Mais recentes" list={researches} />
            {userData?.user_type === 'researcher' && userData?.researches &&  <Section title="Meus projetos" list={userData.researches} /> }
             
        </>
    );
  };

  const getSubtitle = () => {
    switch (userData?.user_type) {
      case 'researcher':
        return userData.profile.campus;
      case 'company':
        return userData.profile.size;
      case 'collaborator':
        return userData.profile.category;
      default:
        return 'Entre com a sua conta para ter acesso a mais funções';
    }};

  const getName = () => {
    switch (userData?.user_type) {
      case 'company':
        return userData.profile.fantasyName;
      case 'collaborator':
        return userData.profile.firstName;
      case 'researcher':
        return userData.profile.firstName;
      default:
        return 'Convidado';
    }};

    const handleLogout = async () => {
      await logoutUser();
      router.replace("/");
    };


  return (
    <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Olá {getName()},</Text>
                <Text style={styles.subtitle}>{getSubtitle()}</Text>
                {/* Ícone de notificação aqui. */}
            </View>
        
            {/* <View style={styles.searchContainer}>
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Explore projetos existentes..."
                />
            </View> */}

            <View style={styles.listArea}>
                 {renderContent()}
            </View>


            <TouchableOpacity onPress={handleLogout} style={styles.retryButton}>
                  <Text style={styles.retryText}>LOGOUT</Text>
            </TouchableOpacity>
           
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
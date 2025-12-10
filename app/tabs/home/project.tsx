
import { ViewContainer } from '@/components/ViewContainer';
import { Text } from '@react-navigation/elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import colors from "@/theme/colors";
import { AppText } from '@/components/AppText';
import { addFavorite, checkFavorite, getPublicResearchById, removeFavorite } from '@/services/researchService';
import { SimpleAccordion } from '@/components/SimpleAccordion';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Feather, Ionicons } from "@expo/vector-icons";
import { getUsers } from '@/services/userService'; 
import { getProfile } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '.';
import { MemberCard } from '@/components/MemberCard';

interface AuthorProfile {
  id: number;
  firstName: string;
  surname: string;
  campus: string;
}

interface AuthorData {
  id: number;
  email: string;
  researcher_profile: AuthorProfile;
  // Potencialmente outros tipos de perfil, se necessário, mas por enquanto apenas pesquisador
}

export interface ProjectData {
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
}



export default function Project() {
    const router = useRouter();
    const [favoriteId, setFavoriteId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<ProjectData | null>(null);
    const [author, setAuthor] = useState<AuthorData | null>(null); 
    const [company, setCompany] = useState<any | null>(null); 
    const [userData, setUserData] = useState<UserData | null>(null)
    const [membersInfos, setMembersInfos] = useState<any[]>([]);

    const projectId = Number(id);

      const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            let user: UserData | null = null
            const token = await AsyncStorage.getItem("authToken")
            if (token) {
              user = await getProfile()
            }
            
            setUserData(user);

        } catch (e) {
            setError("Não foi possível carregar os dados. Tente novamente.");
        } finally {
            setLoading(false);
        }
      };


      
      const fetchProject = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const project = await getPublicResearchById(projectId); 

            if (userData !== null){
              const favoriteId = await checkFavorite(projectId)
              if (favoriteId) {
                setFavoriteId(favoriteId)  
              }
            }
            
            if (project && project.researcher) {
                const users = await getUsers();
                const authorData = users.find(
                    (user: any) => user.researcher_profile?.id === project.researcher
                );
                setAuthor(authorData);
            }

            if (project && project.sponsoring_company) {
                const users = await getUsers();
                const companyData = users.find(
                    (user: any) => user.company_profile?.id === project.sponsoring_company
                );
                setCompany(companyData);
            }
        
            setProject(project);

            if (project && project.members) {
              const users = await getUsers();
              const membersInfos = project.members
                .map((memberId: string) => {
                  const user = users.find((u: any) => u.id === Number(memberId));
                  if (user?.researcher_profile) {
                    return {name: user.researcher_profile.firstName, email: user.email}; 
                  }
                  if (user?.collaborator_profile) {
                    return {name: user.collaborator_profile.firstName, email: user.email};
                  }
                  if (user?.company_profile) {
                    return {name: user.company_profile.fantasyName, email: user.email};
                  }
                  return null;
                })
                .filter(Boolean);

              setMembersInfos(membersInfos);
            }

        } catch (e) {
            setError("Não foi possível carregar o projeto. Tente novamente.");
            setProject(null);
            setAuthor(null);
        } finally {
            setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchProject();
        fetchUserData();
      }, []);
    
      const onRefresh = async () => {
        setRefreshing(true);
        await fetchProject();
        setRefreshing(false);
      };

      const handleContact = () => {
          // Logica para contato
      }

      const handleFavorite = async () => {
          try {
            if (favoriteId) {
              await removeFavorite(favoriteId);
              setFavoriteId(null);
            } else {              
              const favoriteId = (await addFavorite(projectId)).id;
              setFavoriteId(favoriteId);
            }
          } catch (error) {
            Alert.alert("Erro", "Não foi possível atualizar o favorito.");
          }
      }
    

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
                      <TouchableOpacity onPress={fetchProject} style={styles.retryButton}>
                           <Text style={styles.retryText}>Tentar Novamente</Text>
                      </TouchableOpacity>
                  </View>
              );
          }

          return (
              <>
                <View style={styles.header}>
                <Text style={styles.title}>Informações do projeto</Text>
                {userData !== null ? (favoriteId ? <Ionicons name='star' onPress={handleFavorite} size={30} color={colors.primary}/> : <Ionicons name='star-outline' onPress={handleFavorite} size={30} color={colors.primary}/>) : null}
                
                </View>
                <View style={styles.box}>
                  <AppText style={styles.name}>Titulo:</AppText>
                  <AppText style={styles.subtitle}>{project && project.title}</AppText>
                  <AppText style={styles.name}>Área de Conhecimento:</AppText>
                  <AppText style={styles.subtitle}>{project && project.knowledge_area}</AppText>
                  <AppText style={styles.name}>Palavras chave:</AppText>
                  <AppText style={styles.subtitle}>{project && project.keywords.join(", ")}</AppText>
                  <AppText style={styles.name}>Campus:</AppText>
                  <AppText style={styles.subtitle}>{project && project.campus}</AppText>
                  <AppText style={styles.name}>Status:</AppText>
                  <AppText style={styles.subtitle}>{project && project.status}</AppText>
                </View>

                {author && author.researcher_profile && (
                    <TouchableOpacity style={[styles.box, styles.autorContainer]} onPress={() => router.push(`/tabs/home/author-profile?id=${author.id}`)}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.autor}>Autor</Text>
                            <Text style={styles.autorNome}>{author.researcher_profile.firstName} {author.researcher_profile.surname}</Text>
                            <Text style={styles.autorEmail}>{author.email}</Text>
                            <Text style={styles.autorCampus}>{author.researcher_profile.campus}</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="#003A7A" />
                    </TouchableOpacity>
                )}
                {company && company.company_profile && (
                    <TouchableOpacity style={[styles.box, styles.autorContainer]} onPress={() => router.push(`/tabs/home/company-profile?id=${company.id}`)}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.autor}>Empresa Financiadora</Text>
                            <Text style={styles.autorNome}>{company.company_profile.fantasyName}</Text>
                            <Text style={styles.autorEmail}>{company.email}</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="#003A7A" />
                    </TouchableOpacity>
                )}
                
                <SimpleAccordion title="Descrição" style={{marginTop: 10}}>
                  {project && project.description}
                </SimpleAccordion>

                <SimpleAccordion title="Membros" style={{marginTop: 10, marginBottom: 5}}>
                    <View>
                    {membersInfos.map(member => (
                        <MemberCard 
                            key={member.email}
                            name={member.name} 
                            email={member.email}
                        />
                    ))}
                    </View>
                </SimpleAccordion>


              </>
          );
        };




  return  (    
        <View style={styles.safeArea}>
          <ViewContainer style={{justifyContent: "flex-start", paddingVertical: 20}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
          
          {renderContent()}
          
          </ViewContainer>
        </View>)
}

const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    star:{
      color: colors.primary
    },
    autor: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700"
    },
    header:{
      flexDirection: "row"
    },
    box: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
    height:"auto",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(152, 152, 152, 0.10)",
    backgroundColor: "#F5F8FF",
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    lineHeight:23,
    fontWeight: "500",
    color: colors.primary,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  subtitle: {
    fontSize: 20,
    lineHeight:23,
    fontWeight: "100",
    color: "#808080",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginEnd: "auto",
    marginBottom: 15,
    color: colors.primary,
    fontFamily: "Roboto",
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
        backgroundColor: colors.primary,
        borderRadius: 5,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
    autorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    autorNome: {
      fontSize: 17,
      fontWeight: '500',
      color: '#333',
    },
    autorEmail: {
      fontSize: 14,
      color: colors.primary,
      marginVertical: 2,
    },
    autorCampus: {
      fontSize: 14,
      color: '#666',
    },
})
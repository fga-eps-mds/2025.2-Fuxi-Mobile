
import { ViewContainer } from '@/components/ViewContainer';
import { Text } from '@react-navigation/elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import colors from "@/theme/colors";
import { AppText } from '@/components/AppText';
import { SimpleAccordion } from '@/components/SimpleAccordion';
import { Feather, Ionicons } from "@expo/vector-icons";
import { getUsers } from '@/services/userService'; 
import { getPublicDemandById } from '@/services/demandService';

interface CompanyProfile {
  id: number;
  fantasyName: string;
}

interface CompanyData {
  id: number;
  email: string;
  company_profile: CompanyProfile;
  // Potencialmente outros tipos de perfil, se necessário, mas por enquanto apenas pesquisador
}

export interface DemandData {
  id: number;
  company: number;
  title: string;
  description: string;
  knowledge_area: string;
}


export default function Demand() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useLocalSearchParams();
    const [demand, setDemand] = useState<DemandData | null>(null);
    const [company, setCompany] = useState<CompanyData | null>(null); 
    const demandId = Number(id);


      
      const fetchDemand = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const demand = await getPublicDemandById(demandId); 
            
            if (demand && demand.company) {
                const users = await getUsers();
                const companyData = users.find(
                    (user: any) => user.company_profile?.id === demand.company
                );
                setCompany(companyData);
            }
        
            setDemand(demand);
        } catch (e) {
            setError("Não foi possível carregar a demanda. Tente novamente.");
            setDemand(null);
            setCompany(null);
        } finally {
            setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchDemand();
      }, []);
    
      const onRefresh = async () => {
        setRefreshing(true);
        await fetchDemand();
        setRefreshing(false);
      };

      const handleContact = () => {
          // Logica para contato
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
                      <TouchableOpacity onPress={fetchDemand} style={styles.retryButton}>
                           <Text style={styles.retryText}>Tentar Novamente</Text>
                      </TouchableOpacity>
                  </View>
              );
          }

          return (
              <>
                <View style={styles.header}>
                <Text style={styles.title}>Informações da demanda</Text>
                
                </View>
                <View style={styles.box}>
                  <AppText style={styles.name}>Titulo:</AppText>
                  <AppText style={styles.subtitle}>{demand && demand.title}</AppText>
                  <AppText style={styles.name}>Área de Conhecimento:</AppText>
                  <AppText style={styles.subtitle}>{demand && demand.knowledge_area}</AppText>
                </View>

                {company && company.company_profile && (
                    <TouchableOpacity style={[styles.box, styles.empresaContainer]} onPress={() => router.push(`/tabs/home/company-profile?id=${company.id}`)}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.empresa}>Empresa</Text>
                            <Text style={styles.empresaNome}>{company.company_profile.fantasyName}</Text>
                            <Text style={styles.empresaEmail}>{company.email}</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="#003A7A" />
                    </TouchableOpacity>
                )}

                <SimpleAccordion title="Descrição" style={{marginTop: 10}}>
                  {demand && demand.description}
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
    empresa: {
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
    empresaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    empresaNome: {
      fontSize: 17,
      fontWeight: '500',
      color: '#333',
    },
    empresaEmail: {
      fontSize: 14,
      color: colors.primary,
      marginVertical: 2,
    },
    empresaCampus: {
      fontSize: 14,
      color: '#666',
    },
})
import { ViewContainer } from '@/components/ViewContainer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUser } from '@/services/userService';
import colors from '@/theme/colors';
import { DemandData } from '../home/index';
import { DemandCard } from '@/components/DemandCard';
import { getDemands } from '@/services/demandService';

interface CompanyProfile {
  id: number;
  fantasyName: string;
}

interface CompanyData {
  id: number;
  email: string;
  company_profile: CompanyProfile;
}

export default function CompanyPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const companyId = Number(id);

    const [company, setCompany] = useState<CompanyData | null>(null);
    const [demands, setDemands] = useState<DemandData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!companyId) {
            setError("ID da empresa não encontrada.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            
            const companyData = await getUser(companyId);
            setCompany(companyData);

            
            if (companyData && companyData.company_profile) {
                const allDemands = await getDemands();
                const companyDemands = allDemands.filter(
                    (p: DemandData) => p.company === companyData.company_profile.id
                );
                setDemands(companyDemands);
            }
        } catch (e) {
            console.error(e);
            setError("Não foi possível carregar os dados da empresa.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyId]);

    const handleDemandPress = (demandId: number) => {
        router.push(`/tabs/home/demand?id=${demandId}`);
    };

    if (loading) {
        return (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !company) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>{error || "Empresa não encontrada."}</Text>
                <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
                    <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ViewContainer style={styles.container}>
            <View style={styles.companyCard}>
                <Text style={styles.companyName}>
                    {company.company_profile.fantasyName}
                </Text>
                <Text style={styles.companyEmail}>{company.email}</Text>
            </View>
            
            <Text style={styles.demandsTitle}>Mais demandas</Text>
            {demands.length > 0 ? (
                demands.map((item) => (
                    <DemandCard key={item.id.toString()} demand={item} onPress={() => handleDemandPress(item.id)} />
                ))
            ) : (
                <Text style={styles.noProjectsText}>Nenhuma outra demanda encontrada.</Text>
            )}
        </ViewContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: "flex-start",
    },
    feedbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
    companyCard: {
        backgroundColor: '#F5F8FF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(152, 152, 152, 0.10)",
    },
    companyName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    companyEmail: {
        fontSize: 16,
        color: colors.primary,
        marginVertical: 4,
        textAlign: 'center',
    },
    companyCampus: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    demandsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
    },
    noProjectsText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});
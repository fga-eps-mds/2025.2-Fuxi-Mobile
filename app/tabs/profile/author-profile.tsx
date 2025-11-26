import { ViewContainer } from '@/components/ViewContainer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ResearchCard } from '@/components/ResearchCard';
import { getUser } from '@/services/userService';
import { getResearches } from '@/services/researchService';
import colors from '@/theme/colors';
import { ResearchData } from '../home/index';

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
}

export default function AuthorPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const authorId = Number(id);

    const [author, setAuthor] = useState<AuthorData | null>(null);
    const [projects, setProjects] = useState<ResearchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!authorId) {
            setError("ID do autor não encontrado.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            
            const authorData = await getUser(authorId);
            setAuthor(authorData);

            
            if (authorData && authorData.researcher_profile) {
                const allProjects = await getResearches();
                const authorProjects = allProjects.filter(
                    (p: ResearchData) => p.researcher === authorData.researcher_profile.id
                );
                setProjects(authorProjects);
            }
        } catch (e) {
            console.error(e);
            setError("Não foi possível carregar os dados do autor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [authorId]);

    const handleProjectPress = (projectId: number) => {
        router.push(`/tabs/home/project?id=${projectId}`);
    };

    if (loading) {
        return (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !author) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>{error || "Autor não encontrado."}</Text>
                <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
                    <Text style={styles.retryText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ViewContainer style={styles.container}>
            {/* Author Info Box */}
            <View style={styles.authorCard}>
                <Text style={styles.authorName}>
                    {author.researcher_profile.firstName} {author.researcher_profile.surname}
                </Text>
                <Text style={styles.authorEmail}>{author.email}</Text>
                <Text style={styles.authorCampus}>{author.researcher_profile.campus}</Text>
            </View>

            {/* Projects List */}
            <Text style={styles.projectsTitle}>Mais projetos</Text>
            {projects.length > 0 ? (
                projects.map((item) => (
                    <ResearchCard key={item.id.toString()} research={item} onPress={() => handleProjectPress(item.id)} />
                ))
            ) : (
                <Text style={styles.noProjectsText}>Nenhum outro projeto encontrado.</Text>
            )}
        </ViewContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
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
    authorCard: {
        backgroundColor: '#F5F8FF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(152, 152, 152, 0.10)",
    },
    authorName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    authorEmail: {
        fontSize: 16,
        color: colors.primary,
        marginVertical: 4,
        textAlign: 'center',
    },
    authorCampus: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    projectsTitle: {
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
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getMyResearches, deleteResearch } from '@/services/researchService';
import { ResearchData } from '../home';
import { ResearchCard } from '@/components/ResearchCard';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { useRouter } from 'expo-router';

export default function ResearcherProjectsScreen() {
  const [researches, setResearches] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchMyResearches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyResearches();
      if (data) {
        setResearches(data);
      } else {
        setResearches([]);
      }
    } catch (e) {
      setError('Não foi possível carregar seus projetos. Tente novamente.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResearches();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/tabs/profile/edit-project?id=${id}`);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este projeto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResearch(id);
              setResearches((prevResearches) => prevResearches.filter((r) => r.id !== id));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o projeto. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.feedbackContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText style={{ marginTop: 10 }}>Carregando projetos...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <AppText style={styles.errorText}>{error}</AppText>
        <TouchableOpacity onPress={fetchMyResearches} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={researches}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ResearchCard
          research={item}
          showActions={true}
          onEdit={() => handleEdit(item.id)}
          onDelete={() => handleDelete(item.id)}
        />
      )}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 30 }}
      ListEmptyComponent={
        <View style={styles.feedbackContainer}>
          <AppText>Você ainda não possui projetos de pesquisa.</AppText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
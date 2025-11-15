import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getMyResearches } from '@/services/researchService';
import { ResearchData } from '../home';
import { ResearchCard } from '@/components/ResearchCard';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

export default function ResearcherProjectsScreen() {
  const [researches, setResearches] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      renderItem={({ item }) => <ResearchCard research={item} onPress={() => {}} />}
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
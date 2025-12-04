import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getMyDemands, deleteDemand } from '@/services/demandService';
import { DemandData } from '../home';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { useRouter } from 'expo-router';
import { DemandCard } from '@/components/DemandCard';

export default function CompanyDemandsScreen() {
  const [demands, setDemands] = useState<DemandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchMyDemands = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyDemands();
      if (data) {
        setDemands(data);
      } else {
        setDemands([]);
      }
    } catch (e) {
      setError('Não foi possível carregar seus projetos. Tente novamente.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDemands();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/tabs/profile/edit-demand?id=${id}`);
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
              await deleteDemand(id);
              setDemands((prevDemands) => prevDemands.filter((r) => r.id !== id));
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
        <AppText style={{ marginTop: 10 }}>Carregando demandas...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <AppText style={styles.errorText}>{error}</AppText>
        <TouchableOpacity onPress={fetchMyDemands} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={demands}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <DemandCard
          demand={item}
          showActions={true}
          onEdit={() => handleEdit(item.id)}
          onDelete={() => handleDelete(item.id)}
        />
      )}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 30 }}
      ListEmptyComponent={
        <View style={styles.feedbackContainer}>
          <AppText>Você ainda não possui demandas.</AppText>
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
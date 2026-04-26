import { useCallback, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Bow } from '@/src/models';
import { BowRepository } from '@/src/repositories/bow-repository';

export default function HomeScreen() {
  const router = useRouter();
  const [bows, setBows] = useState<Bow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBows = useCallback(async () => {
    try {
      const data = await BowRepository.getAll();
      setBows(data);
    } catch (error) {
      console.error('Error loading bows:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBows();
    }, [loadBows])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBows();
  }, [loadBows]);

  const handleDelete = (bow: Bow) => {
    Alert.alert(
      'Eliminar Arco',
      `¿Estás seguro de que quieres eliminar el arco "${bow.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (bow.id) {
              await BowRepository.delete(bow.id);
              loadBows();
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (bow: Bow) => {
    if (bow.id) {
      await BowRepository.setDefault(bow.id);
      loadBows();
    }
  };

  const renderBow = ({ item }: { item: Bow }) => (
    <TouchableOpacity
      style={styles.bowCard}
      onPress={() => router.push(`/bow/${item.id}`)}
    >
      <View style={styles.bowInfo}>
        <View style={styles.bowHeader}>
          <Text style={styles.bowName}>{item.name}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Predeterminado</Text>
            </View>
          )}
        </View>
        <Text style={styles.bowType}>{item.type}</Text>
        {item.model && <Text style={styles.bowDetail}>Modelo: {item.model}</Text>}
        {item.power && <Text style={styles.bowDetail}>Potencia: {item.power} lbs</Text>}
        {item.drawLength && <Text style={styles.bowDetail}>Apertura: {item.drawLength}&quot;</Text>}
      </View>
      <View style={styles.bowActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item)}
          >
            <Text style={styles.actionText}>Predeterminado</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay arcos registrados</Text>
      <Text style={styles.emptySubtext}>Crea tu primer arco para comenzar</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Arcos</Text>
      </View>
      <FlatList
        data={bows}
        keyExtractor={(item) => item.id?.toString() || '0'}
        renderItem={renderBow}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/bow/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  bowCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bowInfo: {
    marginBottom: 12,
  },
  bowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bowName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  bowType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  bowDetail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  bowActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
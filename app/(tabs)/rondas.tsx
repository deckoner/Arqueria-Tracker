import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TargetBoard, useRoundLogic, HeatmapView, HeatmapLegend } from '@/src/components/target';
import { Impact } from '@/src/components/target/target-types';

export default function RondasScreen() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [testImpacts, setTestImpacts] = useState<Impact[]>([]);
  
  const MAX_ARROWS = 10;
  
  const {
    impacts,
    maxArrows,
    addImpact,
    removeImpact,
    resetRound,
    totalScore,
    averageScore,
    canShoot,
  } = useRoundLogic(MAX_ARROWS);

  const handleImpact = useCallback((impact: Omit<Impact, 'id' | 'timestamp'>) => {
    const newImpact: Impact = {
      ...impact,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    addImpact(newImpact);
    setTestImpacts(prev => [...prev, newImpact]);
  }, [addImpact]);

  const handleRemove = useCallback((index: number) => {
    removeImpact(index);
    setTestImpacts(prev => prev.filter((_, i) => i !== index));
  }, [removeImpact]);

  const handleReset = () => {
    resetRound();
    setTestImpacts([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Prueba de Diana</Text>
        <Text style={styles.subtitle}>Seccion para probar componentes</Text>
      </View>

      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{impacts.length}</Text>
          <Text style={styles.scoreLabel}>Flechas</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{totalScore}</Text>
          <Text style={styles.scoreLabel}>Puntos</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{averageScore.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Media</Text>
        </View>
      </View>

      <View style={styles.targetContainer}>
        <TargetBoard
          impacts={impacts}
          maxImpacts={maxArrows}
          onImpact={handleImpact}
          onRemoveImpact={handleRemove}
          enabled={canShoot}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Text style={styles.buttonText}>
            {showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {showHeatmap && testImpacts.length > 0 && (
        <View style={styles.heatmapSection}>
          <Text style={styles.sectionTitle}>Mapa de Calor</Text>
          <HeatmapView impacts={testImpacts} size={280} />
          <HeatmapLegend maxValue={10} />
        </View>
      )}

      {!canShoot && impacts.length >= MAX_ARROWS && (
        <View style={styles.message}>
          <Text style={styles.messageText}>
            Has completado las {MAX_ARROWS} flechas
          </Text>
        </View>
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  targetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  heatmapSection: {
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    padding: 16,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
});
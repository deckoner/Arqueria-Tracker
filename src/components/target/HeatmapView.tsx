import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Impact, impactsToHeatmap, getHeatmapColor } from './target-types';

interface HeatmapViewProps {
  impacts: Impact[];
  size?: number;
  gridSize?: number;
}

/**
 * Componente para visualizar heatmap de impactos
 */
export function HeatmapView({ 
  impacts, 
  size = 300, 
  gridSize = 20 
}: HeatmapViewProps) {
  
  const heatmapData = useMemo(() => {
    return impactsToHeatmap(impacts, gridSize);
  }, [impacts, gridSize]);

  const cellSize = size / gridSize;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {heatmapData.grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: getHeatmapColor(value, heatmapData.maxValue),
                }
              ]}
            />
          ))}
        </View>
      ))}
      
      {/* Anillos de referencia (visual) */}
      <View style={styles.ringsOverlay}>
        <View style={[styles.ring, { width: size * 0.9, height: size * 0.9 }]} />
        <View style={[styles.ring, { width: size * 0.7, height: size * 0.7 }]} />
        <View style={[styles.ring, { width: size * 0.5, height: size * 0.5 }]} />
        <View style={[styles.ring, { width: size * 0.3, height: size * 0.3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  ringsOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  legendText: {
    fontSize: 10,
    color: '#999',
  },
  legendColors: {
    flexDirection: 'row',
    gap: 2,
  },
  legendColor: {
    width: 16,
    height: 12,
    borderRadius: 2,
  },
});

/**
 * Componente de leyenda para el heatmap
 */
export function HeatmapLegend({ maxValue }: { maxValue: number }) {
  return (
    <View style={styles.legend}>
      <Text style={styles.legendText}>Menos</Text>
      <View style={styles.legendColors}>
        <View style={[styles.legendColor, { backgroundColor: '#f5f5f5' }]} />
        <View style={[styles.legendColor, { backgroundColor: '#ffebee' }]} />
        <View style={[styles.legendColor, { backgroundColor: '#ffcdd2' }]} />
        <View style={[styles.legendColor, { backgroundColor: '#ef9a9a' }]} />
        <View style={[styles.legendColor, { backgroundColor: '#e57373' }]} />
        <View style={[styles.legendColor, { backgroundColor: '#d32f2f' }]} />
      </View>
      <Text style={styles.legendText}>Mas</Text>
    </View>
  );
}
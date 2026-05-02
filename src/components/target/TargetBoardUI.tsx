import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { 
  TargetConfig, 
  Impact, 
  TargetRing, 
  toRelative, 
  toNormalized,
  calculateScore 
} from './target-types';

interface TargetBoardUIProps {
  size: number;
  config: TargetConfig;
  impacts: Impact[];
  maxImpacts: number;
  onImpact: (x: number, y: number, score: number) => void;
  onRemoveImpact?: (index: number) => void;
  enabled: boolean;
}

/**
 * Componente UI: Solo se encarga de dibujar y manejar interacciones
 */
export function TargetBoardUI({ 
  size, 
  config, 
  impacts, 
  maxImpacts, 
  onImpact, 
  onRemoveImpact,
  enabled 
}: TargetBoardUIProps) {
  
  const handlePress = useCallback((event: any) => {
    if (!enabled) return;
    if (impacts.length >= maxImpacts) return;
    
    const locationX = event.nativeEvent?.locationX;
    const locationY = event.nativeEvent?.locationY;
    
    if (locationX == null || locationY == null) return;
    
    const normalized = toNormalized(locationX, locationY, size);
    const score = calculateScore(normalized.x, normalized.y, config.rings);
    
    onImpact(locationX, locationY, score);
  }, [enabled, impacts.length, maxImpacts, size, config.rings, onImpact]);

  const renderRings = useMemo(() => {
    // Dibujar anillos desde el mas grande al mas pequeño
    // Los circulos rellenos se superponen dejando bandas de color visibles
    return config.rings.map((ring: TargetRing, index: number) => {
      const ringDiameter = size * ring.radius;
      return (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: (size - ringDiameter) / 2,
            top: (size - ringDiameter) / 2,
            width: ringDiameter,
            height: ringDiameter,
            borderRadius: ringDiameter / 2,
            backgroundColor: ring.color,
          }}
        />
      );
    });
  }, [config.rings, size]);

  const renderImpacts = useMemo(() => {
    return impacts.map((impact: Impact, index: number) => {
      const pos = toRelative(impact.x, impact.y, size);
      return (
        <TouchableOpacity
          key={impact.id || index}
          style={[
            styles.impact,
            {
              left: pos.x - 10,
              top: pos.y - 10,
            }
          ]}
          onPress={() => onRemoveImpact?.(index)}
        >
          <View style={styles.impactDot}>
            <View style={styles.impactNumber}>
              <Text style={styles.impactNumberText}>{index + 1}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }, [impacts, size, onRemoveImpact]);

  return (
    <View style={styles.container}>
      <View style={[styles.targetWrapper, { width: size, height: size }]}>
        {renderRings}
        <TouchableOpacity
          style={styles.touchable}
          activeOpacity={1}
          onPress={handlePress}
          disabled={!enabled}
        >
          {renderImpacts}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  targetWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetWrapper: {
    position: 'relative',
    width: size,
    height: size,
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  impact: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  impactDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  impactNumber: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});
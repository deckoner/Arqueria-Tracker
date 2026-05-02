import React, { useState, useCallback, useMemo } from 'react';
import { TargetBoardUI } from './TargetBoardUI';
import { 
  TargetConfig, 
  Impact, 
  NormalizedPoint, 
  toNormalized, 
  calculateScore, 
  createStandardTarget 
} from './target-types';

interface TargetBoardProps {
  config?: TargetConfig;
  impacts: Impact[];
  maxImpacts: number;
  onImpact: (impact: Omit<Impact, 'id' | 'timestamp'>) => void;
  onRemoveImpact?: (index: number) => void;
  enabled: boolean;
}

/**
 * Componente principal de la diana
 * Separa UI de lógica
 */
export function TargetBoard({ 
  config = createStandardTarget(), 
  impacts, 
  maxImpacts, 
  onImpact, 
  onRemoveImpact, 
  enabled 
}: TargetBoardProps) {
  const [size] = useState(300);

  /**
   * Maneja el impacto: convierte coordenadas y calcula puntuacion
   */
  const handleImpact = useCallback((relativeX: number, relativeY: number) => {
    if (impacts.length >= maxImpacts) return;
    
    // Convertir a coordenadas normalizadas
    const normalized: NormalizedPoint = toNormalized(relativeX, relativeY, size);
    
    // Calcular puntuacion
    const score = calculateScore(normalized.x, normalized.y, config.rings);
    
    // Notificar al padre
    onImpact({
      x: normalized.x,
      y: normalized.y,
      score,
      arrowNumber: impacts.length + 1,
    });
  }, [impacts.length, maxImpacts, size, config.rings, onImpact]);

  /**
   * Maneja eliminacion de impacto
   */
  const handleRemove = useCallback((index: number) => {
    onRemoveImpact?.(index);
  }, [onRemoveImpact]);

  /**
   * Calcula el tamaño responsive
   */
  const responsiveSize = useMemo(() => {
    // Por ahora un tamaño fijo, pero puede ser responsive
    return Math.min(size, 350);
  }, [size]);

  return (
    <TargetBoardUI
      size={responsiveSize}
      config={config}
      impacts={impacts}
      maxImpacts={maxImpacts}
      onImpact={handleImpact}
      onRemoveImpact={handleRemove}
      enabled={enabled}
    />
  );
}

/**
 * Hook para manejar logica de ronda
 */
export function useRoundLogic(initialArrows: number) {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [maxArrows, setMaxArrows] = useState(initialArrows);
  
  const addImpact = useCallback((impact: Omit<Impact, 'id' | 'timestamp'>) => {
    const newImpact: Impact = {
      ...impact,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setImpacts(prev => [...prev, newImpact]);
  }, []);

  const removeImpact = useCallback((index: number) => {
    setImpacts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetRound = useCallback(() => {
    setImpacts([]);
  }, []);

  const totalScore = useMemo(() => {
    return impacts.reduce((sum, impact) => sum + impact.score, 0);
  }, [impacts]);

  const averageScore = useMemo(() => {
    if (impacts.length === 0) return 0;
    return totalScore / impacts.length;
  }, [impacts.length, totalScore]);

  return {
    impacts,
    maxArrows,
    setMaxArrows,
    addImpact,
    removeImpact,
    resetRound,
    totalScore,
    averageScore,
    canShoot: impacts.length < maxArrows,
  };
}
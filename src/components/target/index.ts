/**
 * Componentes para diana de tiro con arco
 * 
 * Arquitectura basada en separacion de responsabilidades:
 * - Tipos y logica matematica: target-types.ts
 * - Presentacion UI: TargetBoardUI.tsx
 * - Logica de componente: TargetBoard.tsx
 * - Visualizacion de datos: HeatmapView.tsx
 */

// Tipos y utilidades
export {
  TargetConfig,
  TargetRing,
  Impact,
  NormalizedPoint,
  ZoomConfig,
  HeatmapGrid,
  toNormalized,
  distanceFromCenter,
  calculateScore,
  toRelative,
  createStandardTarget,
  impactsToHeatmap,
  getHeatmapColor,
} from './target-types';

// Componentes UI
export { TargetBoardUI } from './TargetBoardUI';
export { TargetBoard, useRoundLogic } from './TargetBoard';
export { HeatmapView, HeatmapLegend } from './HeatmapView';
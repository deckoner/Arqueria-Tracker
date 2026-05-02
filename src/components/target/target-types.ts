/**
 * Configuracion de diana completamente configurable
 * Usa valores relativos (0-1) para independencia de resolucion
 */
export interface TargetRing {
  radius: number; // Radio relativo (0-1)
  color: string;
  score: number;
}

export interface TargetConfig {
  rings: TargetRing[];
  backgroundColor: string;
  size?: number; // Tamaño base opcional
}

/**
 * Coordenadas normalizadas (-1 a 1)
 * Centro = (0, 0)
 */
export interface NormalizedPoint {
  x: number;
  y: number;
}

/**
 * Impacto con todos sus datos
 */
export interface Impact {
  id: number;
  x: number; // Coordenada normalizada
  y: number; // Coordenada normalizada
  score: number;
  arrowNumber: number;
  timestamp?: string;
}

/**
 * Configuracion de zoom (solo visual)
 */
export interface ZoomConfig {
  enabled: boolean;
  scale: number;
  centerX: number;
  centerY: number;
}

/**
 * Props del componente TargetBoard
 */
export interface TargetBoardProps {
  config: TargetConfig;
  impacts: Impact[];
  maxImpacts: number;
  onImpact: (x: number, y: number, score: number) => void;
  onRemoveImpact?: (index: number) => void;
  zoomConfig?: ZoomConfig;
  showScore?: boolean;
}

/**
 * Estructura para heatmap
 */
export interface HeatmapGrid {
  grid: number[][]; // Matriz de frecuencias
  maxValue: number;
}

/**
 * Utilidades matematicas para coordenadas
 */

/**
 * Convierte coordenadas relativas al tamaño del componente a coordenadas normalizadas (-1 a 1)
 */
export function toNormalized(
  relativeX: number,
  relativeY: number,
  size: number
): NormalizedPoint {
  const center = size / 2;
  const normalizedX = (relativeX - center) / center;
  const normalizedY = (relativeY - center) / center;
  return { x: normalizedX, y: normalizedY };
}

/**
 * Calcula la distancia desde el centro (0, 0)
 */
export function distanceFromCenter(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/**
 * Calcula la puntuacion basada en la distancia al centro
 */
export function calculateScore(x: number, y: number, rings: TargetRing[]): number {
  const distance = distanceFromCenter(x, y);
  
  // Ordenar anillos de interior a exterior
  const sortedRings = [...rings].sort((a, b) => a.radius - b.radius);
  
  for (const ring of sortedRings) {
    if (distance <= ring.radius) {
      return ring.score;
    }
  }
  
  // Fuera de la diana (puntuacion minima)
  return Math.min(...rings.map(r => r.score));
}

/**
 * Convierte coordenadas normalizadas a posicion relativa en el componente
 */
export function toRelative(
  normalizedX: number,
  normalizedY: number,
  size: number
): { x: number; y: number } {
  const center = size / 2;
  return {
    x: center + normalizedX * center,
    y: center + normalizedY * center,
  };
}

/**
 * Genera una configuracion de diana estandar (10 anillos)
 */
export function createStandardTarget(): TargetConfig {
  const rings: TargetRing[] = [];
  // En tiro con arco: radio menor = anillo interior = puntuacion mayor
  for (let i = 1; i <= 10; i++) {
    const score = 11 - i; // 10 para radio 0.1 (interior), 1 para radio 1.0 (exterior)
    rings.push({
      radius: i / 10, // 0.1, 0.2, ..., 1.0
      color: getRingColor(score),
      score: score,
    });
  }
  return {
    rings: rings.sort((a, b) => b.radius - a.radius), // De exterior a interior para renderizado
    backgroundColor: '#fff',
  };
}

/**
 * Colores estandar para los anillos
 */
function getRingColor(score: number): string {
  if (score >= 9) return '#FFD700'; // Oro
  if (score >= 7) return '#C0C0C0'; // Plata
  if (score >= 5) return '#CD7F32'; // Bronce
  if (score >= 3) return '#4169E1'; // Azul
  return '#FF6347'; // Rojo
}

/**
 * Convierte impactos a una cuadricula para heatmap
 */
export function impactsToHeatmap(
  impacts: Impact[],
  gridSize: number = 20
): HeatmapGrid {
  const grid: number[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));
  
  impacts.forEach(impact => {
    const gridX = Math.min(Math.floor((impact.x + 1) / 2 * gridSize), gridSize - 1);
    const gridY = Math.min(Math.floor((impact.y + 1) / 2 * gridSize), gridSize - 1);
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      grid[gridY][gridX]++;
    }
  });
  
  const maxValue = Math.max(...grid.flat(), 1);
  
  return { grid, maxValue };
}

/**
 * Obtiene el color para el heatmap basado en la intensidad
 */
export function getHeatmapColor(value: number, maxValue: number): string {
  if (value === 0) return '#f5f5f5';
  const intensity = value / maxValue;
  if (intensity < 0.2) return '#ffebee';
  if (intensity < 0.4) return '#ffcdd2';
  if (intensity < 0.6) return '#ef9a9a';
  if (intensity < 0.8) return '#e57373';
  return '#d32f2f';
}
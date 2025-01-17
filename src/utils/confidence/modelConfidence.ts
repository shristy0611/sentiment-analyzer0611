import type { ContextFeatures } from '../types';

export function calculateModelConfidence(
  transformerScore?: number,
  totalWords?: number
): number {
  if (!transformerScore) return 50;

  let confidence = transformerScore * 100;

  // Adjust for text length
  if (totalWords) {
    if (totalWords < 3) {
      confidence *= 0.7; // Very short text is less reliable
    } else if (totalWords > 50) {
      confidence *= 0.9; // Very long text might dilute sentiment
    }
  }

  return Math.min(confidence, 100);
}
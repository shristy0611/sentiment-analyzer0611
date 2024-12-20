export function calculateSarcasmImpact(sarcasmProbability: number): number {
  if (sarcasmProbability <= 0.3) return 1.0; // No significant impact
  if (sarcasmProbability >= 0.8) return 0.5; // High impact

  // Linear interpolation between 1.0 and 0.5 for probabilities between 0.3 and 0.8
  return 1.0 - ((sarcasmProbability - 0.3) * (0.5 / 0.5));
}
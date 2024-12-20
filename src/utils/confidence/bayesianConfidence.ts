interface ConfidenceFactors {
  modelConfidence: number;
  contextModifier: number;
  sarcasmImpact: number;
  wordCount: number;
}

export function combineProbabilities({
  modelConfidence,
  contextModifier,
  sarcasmImpact,
  wordCount
}: ConfidenceFactors): number {
  // Convert percentages to probabilities
  const modelProb = modelConfidence / 100;
  
  // Apply Bayesian combination of probabilities
  let combinedProb = modelProb * contextModifier * sarcasmImpact;

  // Adjust for text length
  const lengthFactor = Math.min(1, Math.log10(wordCount + 1) / 2);
  combinedProb *= (0.7 + (0.3 * lengthFactor));

  // Convert back to percentage and ensure it's within bounds
  return Math.min(Math.max(combinedProb * 100, 0), 100);
}
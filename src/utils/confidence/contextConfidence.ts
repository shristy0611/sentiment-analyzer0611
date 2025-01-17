import type { ContextFeatures } from '../types';

export function calculateContextConfidence(context: ContextFeatures): number {
  let confidenceModifier = 1.0;

  // Complex linguistic features reduce confidence
  if (context.hasContrastingClauses) {
    confidenceModifier *= 0.85;
  }

  if (context.negations.length > 0) {
    confidenceModifier *= Math.max(0.8, 1 - (context.negations.length * 0.1));
  }

  if (context.hasEmphasis) {
    confidenceModifier *= 0.9;
  }

  // Multiple sentences might indicate more complex sentiment
  if (context.sentenceCount > 1) {
    confidenceModifier *= Math.max(0.85, 1 - (context.sentenceCount - 1) * 0.05);
  }

  return confidenceModifier;
}
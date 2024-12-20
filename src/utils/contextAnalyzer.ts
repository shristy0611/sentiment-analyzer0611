import { findNegations, findIntensifiers } from './patterns';
import type { ContextFeatures } from './types';

export function analyzeContext(text: string): ContextFeatures {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  return {
    negations: findNegations(text),
    intensifiers: findIntensifiers(text),
    sentenceCount: sentences.length,
    hasContrastingClauses: detectContrastingClauses(text),
    hasQuotes: text.includes('"') || text.includes("'"),
    hasEmphasis: detectEmphasis(text),
    sarcasmIndicators: detectSarcasmIndicators(text)
  };
}

function detectContrastingClauses(text: string): boolean {
  const contrastMarkers = [
    'but', 'however', 'although', 'though', 'yet',
    'nevertheless', 'nonetheless', 'despite', 'in spite of'
  ];
  
  return contrastMarkers.some(marker => 
    new RegExp(`\\b${marker}\\b`, 'i').test(text)
  );
}

function detectEmphasis(text: string): boolean {
  // Check for repeated punctuation, ALL CAPS words, or emphasis markers
  return /[!?]{2,}|[A-Z]{2,}|\*\w+\*|_\w+_/.test(text);
}

function detectSarcasmIndicators(text: string): string[] {
  const indicators: string[] = [];
  const sarcasmPatterns = [
    { pattern: /\b(yeah right|sure thing|totally)\b/i, label: 'sarcastic phrases' },
    { pattern: /[!?]{3,}/, label: 'excessive punctuation' },
    { pattern: /\b(oh really|how wonderful|great job)\b.*[!?]+/i, label: 'exaggerated praise' },
    { pattern: /\((eye roll|sigh)\)/i, label: 'explicit markers' }
  ];

  sarcasmPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      indicators.push(label);
    }
  });

  return indicators;
}
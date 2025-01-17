import { positiveWords, negativeWords } from './constants/words';
import { preprocessText } from './textPreprocessing';
import { analyzeWithTransformer } from './transformerModel';
import { analyzeContext } from './contextAnalyzer';
import {
  calculateModelConfidence,
  calculateContextConfidence,
  calculateSarcasmImpact,
  combineProbabilities
} from './confidence';
import type { SentimentResult, ContextFeatures } from './types';

function calculateConfidence(
  transformerResult?: { score: number },
  context?: ContextFeatures,
  sarcasmProbability?: number,
  totalWords?: number
): number {
  // Calculate base model confidence
  const modelConfidence = calculateModelConfidence(
    transformerResult?.score,
    totalWords
  );

  // Calculate context-based confidence modifier
  const contextModifier = context 
    ? calculateContextConfidence(context)
    : 1.0;

  // Calculate sarcasm impact
  const sarcasmImpact = sarcasmProbability 
    ? calculateSarcasmImpact(sarcasmProbability)
    : 1.0;

  // Combine probabilities using Bayesian approach
  return combineProbabilities({
    modelConfidence,
    contextModifier,
    sarcasmImpact,
    wordCount: totalWords || 1
  });
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  // Preprocess the text
  const processedTokens = preprocessText(text);
  const totalWords = processedTokens.length;

  // Analyze context
  const context = analyzeContext(text);
  
  // Calculate sarcasm probability based on indicators
  const sarcasmProbability = context.sarcasmIndicators.length > 0 
    ? context.sarcasmIndicators.length / 4 // Normalize by max possible indicators
    : 0;

  // Get transformer model prediction
  let transformerResult;
  try {
    transformerResult = await analyzeWithTransformer(text);
  } catch (error) {
    console.warn('Transformer analysis failed:', error);
  }

  // Find sentiment words
  const detectedPositive = processedTokens.filter(token => 
    positiveWords.has(token.toLowerCase())
  );
  const detectedNegative = processedTokens.filter(token => 
    negativeWords.has(token.toLowerCase())
  );

  // Calculate base sentiment score (-5 to 5)
  let score = 0;
  
  if (transformerResult) {
    // If we have transformer results, use them as the primary score
    score = transformerResult.label === 'POSITIVE' 
      ? transformerResult.score * 5
      : -transformerResult.score * 5;
  } else {
    // Fallback to lexicon-based scoring
    const positiveScore = detectedPositive.length;
    const negativeScore = detectedNegative.length;
    score = ((positiveScore - negativeScore) / Math.max(totalWords, 1)) * 5;
  }

  // Adjust score based on context
  if (context.negations.length > 0) {
    score *= -0.8; // Reduce and invert sentiment for negations
  }

  // Calculate confidence
  const confidence = calculateConfidence(
    transformerResult,
    context,
    sarcasmProbability,
    totalWords
  );

  // Determine final sentiment category
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (Math.abs(score) < 0.5) {
    sentiment = 'neutral';
  } else {
    sentiment = score > 0 ? 'positive' : 'negative';
  }

  return {
    score,
    sentiment,
    confidence,
    details: {
      positiveWords: detectedPositive,
      negativeWords: detectedNegative,
      totalWords,
      transformerScore: transformerResult?.score,
      transformerLabel: transformerResult?.label,
      context,
      sarcasmProbability
    }
  };
}
import { pipeline, env } from '@xenova/transformers';
import type { SentimentResult } from './types';

// Disable local model loading (use CDN instead)
env.allowLocalModels = false;

// Initialize the sentiment analysis pipeline
let sentimentPipeline: any = null;

export async function initializeModel() {
  if (!sentimentPipeline) {
    try {
      sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
    } catch (error) {
      console.error('Error initializing model:', error);
      throw new Error('Failed to initialize sentiment analysis model');
    }
  }
  return sentimentPipeline;
}

export async function analyzeWithTransformer(text: string): Promise<{
  label: string;
  score: number;
}> {
  try {
    const pipeline = await initializeModel();
    const result = await pipeline(text);
    return result[0];
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Failed to analyze text');
  }
}
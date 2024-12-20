export type SentimentResult = {
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  details: {
    positiveWords: string[];
    negativeWords: string[];
    totalWords: number;
    transformerScore?: number;
    transformerLabel?: string;
    context?: ContextFeatures;
    sarcasmProbability?: number;
  };
};

export type AnalysisState = {
  loading: boolean;
  error: string | null;
  result: SentimentResult | null;
};

export type ContextFeatures = {
  negations: string[];
  intensifiers: string[];
  sentenceCount: number;
  hasContrastingClauses: boolean;
  hasQuotes: boolean;
  hasEmphasis: boolean;
  sarcasmIndicators: string[];
};
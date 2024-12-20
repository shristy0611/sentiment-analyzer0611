interface Translation {
  appTitle: string;
  welcomeMessage: string;
  enterNickname: string;
  startAnalyzing: string;
  analyzeButton: string;
  analyzing: string;
  summary: string;
  emotionalAnalysis: string;
  psychologicalInsights: string;
  riskAssessment: string;
  enterText: string;
  demoTokens: string;
  tokensRemaining: string;
  noTokensLeft: string;
  languageInfo: {
    detectedLanguage: string;
    confidence: string;
    code: string;
    direction: string;
    leftToRight: string;
    rightToLeft: string;
  };
  emotionalAnalysisDetails: {
    primaryEmotion: string;
    secondaryEmotions: string;
    emotionalIntensity: string;
    emotionalStability: string;
    valence: string;
  };
  psychologicalInsightsDetails: {
    mindsetAnalysis: string;
    cognitivePatterns: string;
    motivations: string;
    cognitiveScore: string;
    potentialBiases: string;
  };
  riskAssessmentDetails: {
    lowRisk: string;
    mediumRisk: string;
    highRisk: string;
    riskLevel: string;
    redFlags: string;
    urgencyLevel: string;
  };
}

const translations: Record<string, Translation> = {
  en: {
    appTitle: 'Advanced Sentiment Analyzer',
    welcomeMessage: 'Welcome to Sentiment Analyzer',
    enterNickname: 'Enter a nickname to start analyzing text with your 10 free tokens',
    startAnalyzing: 'Start Analyzing',
    analyzeButton: 'Analyze',
    analyzing: 'Analyzing...',
    summary: 'Analysis Summary',
    emotionalAnalysis: 'Emotional Analysis',
    psychologicalInsights: 'Psychological Insights',
    riskAssessment: 'Risk Assessment',
    enterText: 'Enter text to analyze...',
    demoTokens: 'Demo Tokens',
    tokensRemaining: 'tokens remaining',
    noTokensLeft: 'No tokens remaining. Maximum 10 analyses allowed in demo mode.',
    languageInfo: {
      detectedLanguage: 'Detected Language',
      confidence: 'Confidence',
      code: 'Code',
      direction: 'Direction',
      leftToRight: 'Left to Right',
      rightToLeft: 'Right to Left'
    },
    emotionalAnalysisDetails: {
      primaryEmotion: 'Primary Emotion',
      secondaryEmotions: 'Secondary Emotions',
      emotionalIntensity: 'Emotional Intensity',
      emotionalStability: 'Emotional Stability',
      valence: 'Emotional Valence'
    },
    psychologicalInsightsDetails: {
      mindsetAnalysis: 'Mindset Analysis',
      cognitivePatterns: 'Cognitive Patterns',
      motivations: 'Motivations',
      cognitiveScore: 'Cognitive Score',
      potentialBiases: 'Potential Cognitive Biases'
    },
    riskAssessmentDetails: {
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      riskLevel: 'Risk Level',
      redFlags: 'Red Flags',
      urgencyLevel: 'Urgency Level'
    }
  },
  ja: {
    appTitle: '高度感情分析ツール',
    welcomeMessage: '感情分析ツールへようこそ',
    enterNickname: 'ニックネームを入力して、10個の無料トークンで分析を始めましょう',
    startAnalyzing: '分析を開始',
    analyzeButton: '分析する',
    analyzing: '分析中...',
    summary: '分析サマリー',
    emotionalAnalysis: '感情分析',
    psychologicalInsights: '心理的洞察',
    riskAssessment: 'リスク評価',
    enterText: '分析するテキストを入力してください...',
    demoTokens: 'デモトークン',
    tokensRemaining: '残りトークン',
    noTokensLeft: 'トークンがありません。デモモードでは最大10回の分析が可能です。',
    languageInfo: {
      detectedLanguage: '検出された言語',
      confidence: '信頼度',
      code: '言語コード',
      direction: '文字方向',
      leftToRight: '左から右',
      rightToLeft: '右から左'
    },
    emotionalAnalysisDetails: {
      primaryEmotion: '主要な感情',
      secondaryEmotions: '副次的な感情',
      emotionalIntensity: '感情の強度',
      emotionalStability: '感情の安定性',
      valence: '感情の価値'
    },
    psychologicalInsightsDetails: {
      mindsetAnalysis: 'マインドセット分析',
      cognitivePatterns: '認知パターン',
      motivations: 'モチベーション',
      cognitiveScore: '認知スコア',
      potentialBiases: '潜在的な認知バイアス'
    },
    riskAssessmentDetails: {
      lowRisk: '低リスク',
      mediumRisk: '中リスク',
      highRisk: '高リスク',
      riskLevel: 'リスクレベル',
      redFlags: '警告フラグ',
      urgencyLevel: '緊急度'
    }
  },
  pt: {
    appTitle: 'Analisador de Sentimentos Avançado',
    welcomeMessage: 'Bem-vindo ao Analisador de Sentimentos',
    enterNickname: 'Digite um apelido para começar a análise com seus 10 tokens gratuitos',
    startAnalyzing: 'Começar a Análise',
    analyzeButton: 'Analisar',
    analyzing: 'Analisando...',
    summary: 'Resumo da Análise',
    emotionalAnalysis: 'Análise Emocional',
    psychologicalInsights: 'Insights Psicológicos',
    riskAssessment: 'Avaliação de Risco',
    enterText: 'Digite o texto para analisar...',
    demoTokens: 'Tokens de Demo',
    tokensRemaining: 'tokens restantes',
    noTokensLeft: 'Sem tokens restantes. Máximo de 10 análises permitidas no modo demo.',
    languageInfo: {
      detectedLanguage: 'Idioma Detectado',
      confidence: 'Confiança',
      code: 'Código',
      direction: 'Direção',
      leftToRight: 'Esquerda para Direita',
      rightToLeft: 'Direita para Esquerda'
    },
    emotionalAnalysisDetails: {
      primaryEmotion: 'Emoção Primária',
      secondaryEmotions: 'Emoções Secundárias',
      emotionalIntensity: 'Intensidade Emocional',
      emotionalStability: 'Estabilidade Emocional',
      valence: 'Valência Emocional'
    },
    psychologicalInsightsDetails: {
      mindsetAnalysis: 'Análise de Mentalidade',
      cognitivePatterns: 'Padrões Cognitivos',
      motivations: 'Motivações',
      cognitiveScore: 'Pontuação Cognitiva',
      potentialBiases: 'Vieses Cognitivos Potenciais'
    },
    riskAssessmentDetails: {
      lowRisk: 'Baixo Risco',
      mediumRisk: 'Risco Médio',
      highRisk: 'Alto Risco',
      riskLevel: 'Nível de Risco',
      redFlags: 'Sinais de Alerta',
      urgencyLevel: 'Nível de Urgência'
    }
  }
};

export const getTranslation = (languageCode: string): Translation => {
  // Only support en, ja, and pt
  const supportedLanguage = ['en', 'ja', 'pt'].includes(languageCode) ? languageCode : 'en';
  return translations[supportedLanguage];
};

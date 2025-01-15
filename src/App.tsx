import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, PROMPTS } from './config';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface LanguageConfig {
  name: string;
  code: string;
  prompt: string;
}

interface Analysis {
  emotional_analysis: {
    primary_emotion: string;
    secondary_emotions: string[];
    emotional_intensity: number;
    emotional_stability: number;
    valence: number;
  };
  psychological_insights: {
    mindset: string;
    cognitive_patterns: string[];
    motivations: string[];
    rationality_score: number;
    cognitive_biases: string[];
  };
  risk_assessment: {
    risk_level: number;
    red_flags: string[];
    urgency: number;
  };
  summary: string;
}

interface AnalysisResults {
  en: Analysis | null;
  ja: Analysis | null;
}

const languageInfo: Record<string, LanguageConfig> = {
  en: {
    name: 'English',
    code: 'en',
    prompt: 'Analyze the following text in English:'
  },
  ja: {
    name: '日本語',
    code: 'ja',
    prompt: '以下のテキストを日本語で感情分析してください：'
  }
};

function App() {
  const [text, setText] = useState('');
  const [analyses, setAnalyses] = useState<AnalysisResults>({ en: null, ja: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const getErrorMessage = (msg: string) => {
    if (selectedLanguage === 'ja') {
      switch (msg) {
        case 'Please enter some text to analyze':
          return 'テキストを入力してください';
        case 'Failed to analyze text':
          return '分析に失敗しました';
        case 'Failed to parse analysis results':
          return '分析結果の解析に失敗しました';
        default:
          return msg;
      }
    }
    return msg;
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      setError(getErrorMessage('Please enter some text to analyze'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Analyze in both languages
      const results = await Promise.all([
        // English analysis
        model.generateContent(`${languageInfo.en.prompt}\n\nText to analyze: "${text}"\n\n${PROMPTS.ANALYSIS}`),
        // Japanese analysis
        model.generateContent(`${languageInfo.ja.prompt}\n\nText to analyze: "${text}"\n\n${PROMPTS.ANALYSIS}`)
      ]);

      const [enResponse, jaResponse] = results;
      const enAnalysisText = enResponse.response.text();
      const jaAnalysisText = jaResponse.response.text();
      
      try {
        const enAnalysisData = JSON.parse(enAnalysisText);
        const jaAnalysisData = JSON.parse(jaAnalysisText);
        
        setAnalyses({
          en: enAnalysisData,
          ja: jaAnalysisData
        });
      } catch (e) {
        setError(getErrorMessage('Failed to parse analysis results'));
        console.error('Parse error:', e);
      }
    } catch (e) {
      setError(getErrorMessage('Failed to analyze text'));
      console.error('API error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Get the current analysis based on selected language
  const analysis = analyses[selectedLanguage as keyof AnalysisResults];

  const getLocalizedLabels = () => {
    return selectedLanguage === 'ja' ? {
      title: '感情分析ツール',
      analyze: '分析する',
      analyzing: '分析中...',
      results: '分析結果',
      emotional: {
        title: '感情分析',
        primary: '主な感情',
        secondary: '副次的な感情',
        intensity: '感情の強度'
      },
      psychological: {
        title: '心理分析',
        mindset: '心理状態',
        rationality: '合理性',
        patterns: '思考パターン'
      },
      risk: {
        title: 'リスク評価',
        level: 'リスク度',
        flags: '警告点'
      },
      summary: {
        title: '総括'
      }
    } : {
      title: 'Sentiment Analyzer',
      analyze: 'Analyze',
      analyzing: 'Analyzing...',
      results: 'Analysis Results',
      emotional: {
        title: 'Emotional Analysis',
        primary: 'Primary',
        secondary: 'Secondary',
        intensity: 'Intensity'
      },
      psychological: {
        title: 'Psychological Insights',
        mindset: 'Mindset',
        rationality: 'Rationality',
        patterns: 'Patterns'
      },
      risk: {
        title: 'Risk Assessment',
        level: 'Risk Level',
        flags: 'Red Flags'
      },
      summary: {
        title: 'Summary'
      }
    };
  };

  const labels = getLocalizedLabels();

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                  {labels.title}
                </h2>

                <div className="mb-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {Object.entries(languageInfo).map(([code, lang]) => (
                      <option key={code} value={code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={selectedLanguage === 'en' ? "Enter text to analyze..." : "分析するテキストを入力してください..."}
                  className="w-full p-2 border rounded"
                  rows={4}
                />

                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}

                <button
                  onClick={analyzeText}
                  disabled={loading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? labels.analyzing : labels.analyze}
                </button>

                {analysis && analysis.emotional_analysis && (
                  <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                      {labels.results}
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-3">{labels.emotional.title}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-blue-700 font-medium w-32">{labels.emotional.primary}:</span>
                            <span className="text-blue-900">{analysis.emotional_analysis.primary_emotion}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-blue-700 font-medium w-32">{labels.emotional.secondary}:</span>
                            <span className="text-blue-900">{analysis.emotional_analysis.secondary_emotions?.join('、') || ''}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">{labels.emotional.intensity}:</span>
                            <div className="mt-1 h-2 relative w-full bg-blue-200 rounded">
                              <div 
                                className="absolute h-full bg-blue-600 rounded" 
                                style={{ width: `${(analysis.emotional_analysis.emotional_intensity || 0) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-blue-900">
                              {((analysis.emotional_analysis.emotional_intensity || 0) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {analysis.psychological_insights && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-3">{labels.psychological.title}</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-purple-700 font-medium">{labels.psychological.mindset}:</span>
                              <p className="mt-1 text-purple-900">{analysis.psychological_insights.mindset}</p>
                            </div>
                            <div>
                              <span className="text-purple-700 font-medium">{labels.psychological.rationality}:</span>
                              <div className="mt-1 h-2 relative w-full bg-purple-200 rounded">
                                <div 
                                  className="absolute h-full bg-purple-600 rounded" 
                                  style={{ width: `${(analysis.psychological_insights.rationality_score || 0) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-purple-900">
                                {((analysis.psychological_insights.rationality_score || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                            {analysis.psychological_insights.cognitive_patterns?.length > 0 && (
                              <div>
                                <span className="text-purple-700 font-medium">{labels.psychological.patterns}:</span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {analysis.psychological_insights.cognitive_patterns.map((pattern, index) => (
                                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                                      {pattern}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {analysis.risk_assessment && (
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-medium text-amber-800 mb-3">{labels.risk.title}</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-amber-700 font-medium">{labels.risk.level}:</span>
                              <div className="mt-1 h-2 relative w-full bg-amber-200 rounded">
                                <div 
                                  className="absolute h-full bg-amber-600 rounded" 
                                  style={{ width: `${(analysis.risk_assessment.risk_level || 0) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-amber-900">
                                {((analysis.risk_assessment.risk_level || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                            {analysis.risk_assessment.red_flags?.length > 0 && (
                              <div>
                                <span className="text-amber-700 font-medium">{labels.risk.flags}:</span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {analysis.risk_assessment.red_flags.map((flag, index) => (
                                    <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                                      {flag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {analysis.summary && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">{labels.summary.title}</h4>
                          <p className="text-gray-700">{analysis.summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
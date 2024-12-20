import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { EmotionRadar } from './components/EmotionRadar';
import { RiskGauge } from './components/RiskGauge';
import { InsightCard } from './components/InsightCard';
import { TokenDisplay } from './components/TokenDisplay';
import { LanguageInfo } from './components/LanguageInfo';
import { WelcomeTransition } from './components/WelcomeTransition';
import { CulturalNicknameInput } from './components/CulturalNicknameInput';
import { useResponsiveWidth } from './hooks/useResponsiveWidth';
import { getTranslation } from './utils/translations';

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
  language_info: {
    language_code: string;
    language_name: string;
    native_name: string;
    confidence: number;
    direction: string;
  };
  summary: string;
}

function App() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [remainingTokens, setRemainingTokens] = useState<number>(10);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [showWelcome, setShowWelcome] = useState(false);

  const panelWidth = useResponsiveWidth();

  // Get translations based on detected language
  const t = getTranslation(analysis?.language_info?.language_code || detectedLanguage);

  useEffect(() => {
    if (isRegistered && nickname) {
      setWelcomeMessage(`${t.welcomeMessage} ${nickname}! ${remainingTokens} ${t.tokensRemaining}`);
    }
  }, [remainingTokens, nickname, isRegistered, analysis?.language_info?.language_code]);

  const handleNicknameSubmit = async (name: string, language: string) => {
    setNickname(name);
    setDetectedLanguage(language);
    setShowWelcome(true);  // Show welcome transition after name submission
    
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: name }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      
      const tokenResponse = await fetch(`http://localhost:8000/api/tokens/${name}`);
      const tokenData = await tokenResponse.json();
      setRemainingTokens(tokenData.remaining_tokens);
    } catch (err) {
      setError('Failed to register. Please try again.');
      setShowWelcome(false); // Reset if registration fails
    }
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
        <AnimatePresence mode="wait">
          {!showWelcome && <CulturalNicknameInput onSubmit={handleNicknameSubmit} />}
        </AnimatePresence>
        <WelcomeTransition
          show={showWelcome}
          name={nickname}
          language={detectedLanguage}
          onComplete={() => {
            setShowWelcome(false);
            setIsRegistered(true);
          }}
        />
      </div>
    );
  }

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, nickname }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze text');
      }

      const data = await response.json();
      setAnalysis(data);
      setRemainingTokens(data.tokens_remaining);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main 
        className={`transition-all duration-300 ml-0`}
      >
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t.appTitle}</h1>
            <p className="mt-2 text-gray-600">
              {welcomeMessage}
            </p>
          </div>

          <div className="mb-6">
            <TokenDisplay remainingTokens={remainingTokens} maxTokens={10} translations={{
              demoTokens: t.demoTokens,
              tokensRemaining: t.tokensRemaining
            }} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.enterText}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              onClick={analyzeText}
              disabled={loading}
              className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-4 w-4" />
                  {t.analyzeButton}
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="space-y-8">
              <LanguageInfo 
                languageInfo={analysis.language_info} 
                translations={t.languageInfo}
              />
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.summary}</h2>
                <p className="text-gray-700 mb-4">{analysis.summary}</p>
              </div>

              <Tabs.Root defaultValue="emotional" className="bg-white rounded-lg shadow-sm">
                <Tabs.List className="flex border-b border-gray-200">
                  <Tabs.Trigger
                    value="emotional"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 focus:outline-none data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600"
                  >
                    {t.emotionalAnalysis}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="psychological"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 focus:outline-none data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600"
                  >
                    {t.psychologicalInsights}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="risk"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 focus:outline-none data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600"
                  >
                    {t.riskAssessment}
                  </Tabs.Trigger>
                </Tabs.List>

                <div className="p-6">
                  <Tabs.Content value="emotional" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t.emotionalAnalysisDetails.primaryEmotion}</h3>
                        <div className="text-3xl font-bold text-indigo-600 mb-2">
                          {analysis.emotional_analysis.primary_emotion}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              {t.emotionalAnalysisDetails.secondaryEmotions}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.emotional_analysis.secondary_emotions.map((emotion, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {emotion}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <EmotionRadar
                          data={{
                            intensity: analysis.emotional_analysis.emotional_intensity,
                            stability: analysis.emotional_analysis.emotional_stability,
                            valence: analysis.emotional_analysis.valence
                          }}
                          translations={{
                            intensity: t.emotionalAnalysisDetails.emotionalIntensity,
                            stability: t.emotionalAnalysisDetails.emotionalStability,
                            valence: t.emotionalAnalysisDetails.valence
                          }}
                        />
                      </div>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="psychological" className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">{t.psychologicalInsightsDetails.mindsetAnalysis}</h3>
                          <p className="text-gray-700">{analysis.psychological_insights.mindset}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.psychologicalInsightsDetails.cognitivePatterns}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {analysis.psychological_insights.cognitive_patterns.map((pattern, index) => (
                              <li key={index}>{pattern}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.psychologicalInsightsDetails.motivations}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {analysis.psychological_insights.motivations.map((motivation, index) => (
                              <li key={index}>{motivation}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.psychologicalInsightsDetails.cognitiveScore}</h4>
                          <div className="text-3xl font-bold text-indigo-600">{Math.round(analysis.psychological_insights.rationality_score * 100)}%</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.psychologicalInsightsDetails.potentialBiases}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {analysis.psychological_insights.cognitive_biases.map((bias, index) => (
                              <li key={index}>{bias}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="risk" className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <RiskGauge 
                          riskLevel={analysis.risk_assessment.risk_level}
                          translations={{
                            lowRisk: t.riskAssessmentDetails.lowRisk,
                            mediumRisk: t.riskAssessmentDetails.mediumRisk,
                            highRisk: t.riskAssessmentDetails.highRisk,
                            riskLevel: t.riskAssessmentDetails.riskLevel
                          }}
                        />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.riskAssessmentDetails.redFlags}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {analysis.risk_assessment.red_flags.map((flag, index) => (
                              <li key={index}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.riskAssessmentDetails.urgencyLevel}</h4>
                          <div className="text-3xl font-bold text-indigo-600">{Math.round(analysis.risk_assessment.urgency * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  </Tabs.Content>
                </div>
              </Tabs.Root>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
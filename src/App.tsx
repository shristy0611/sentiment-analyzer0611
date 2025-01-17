import { useState, useCallback, useMemo, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, PROMPTS } from './config';
import './App.css';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const DEBOUNCE_DELAY = 300; // ms

interface BusinessAnalysis {
  sentiment_analysis: {
    overall_sentiment: string;
    sentiment_score: number;
    key_sentiments: string[];
    emotional_triggers: string[];
  };
  business_insights: {
    customer_satisfaction_indicators: {
      satisfaction_level: number;
      pain_points: string[];
      positive_aspects: string[];
    };
    action_items: {
      immediate_actions: string[];
      long_term_recommendations: string[];
    };
    market_intelligence: {
      mentioned_competitors: string[];
      product_feedback: string[];
      feature_requests: string[];
    };
  };
  communication_analysis: {
    tone: string;
    formality_level: number;
    key_phrases: string[];
    communication_style: string;
  };
  risk_compliance: {
    potential_risks: string[];
    compliance_flags: string[];
    severity_level: number;
  };
  customer_profile: {
    demographic_indicators: string[];
    behavioral_patterns: string[];
    preference_indicators: string[];
  };
  executive_summary: string;
}

// Memoize translations to prevent unnecessary re-renders
const translations = {
  en: {
    title: 'Business Intelligence Analyzer',
    subtitle: 'Powered by AI',
    placeholder: 'Enter customer feedback, reviews, or any business text to analyze...',
    analyze: 'Analyze Text',
    analyzing: 'Analyzing...',
    sentiment: {
      title: 'Sentiment Analysis',
      overall: 'Overall Sentiment',
      positive: 'positive',
      negative: 'negative',
      neutral: 'neutral'
    },
    sections: {
      satisfaction: 'Customer Satisfaction',
      competition: 'Competitive Analysis',
      painPoints: 'Pain Points',
      positiveAspects: 'Positive Aspects',
      actions: 'Action Items',
      immediateActions: 'Immediate Actions',
      longTermActions: 'Long-term Recommendations',
      productFeedback: 'Product Feedback'
    },
    executive: {
      title: 'Executive Summary'
    },
    errors: {
      empty: 'Please enter some text to analyze',
      parse: 'Failed to parse analysis results. Please try again.',
      api: 'Failed to analyze text. Please check your API key and try again.',
      debug: 'Show Debug Info'
    },
    examples: 'Try an example',
    satisfaction: {
      analysis: 'Satisfaction Analysis',
      criticalConcern: 'Critical Concern',
      needsImprovement: 'Needs Improvement',
      satisfactory: 'Satisfactory',
      excellent: 'Excellent',
      strongMessage: "Customer satisfaction is strong, indicating effective product and service delivery. Continue maintaining high standards while looking for opportunities to exceed expectations.",
      moderateMessage: "Moderate satisfaction levels suggest room for improvement. Focus on addressing identified pain points and enhancing positive aspects.",
      lowMessage: "Low satisfaction levels require immediate attention. Prioritize addressing critical issues and implementing customer feedback.",
      painPoints: 'Pain Points',
      positiveAspects: 'Positive Aspects',
      actionItems: 'Action Items',
      identifiedIssues: 'Identified Issues',
      strengths: 'Strengths',
      recommendations: 'Recommendations'
    }
  },
  ja: {
    title: 'ビジネスインテリジェンスアナライザー',
    subtitle: 'AI 搭載',
    placeholder: 'カスタマーフィードバック、レビュー、またはビジネステキストを入力してください...',
    analyze: 'テキストを分析',
    analyzing: '分析中...',
    sentiment: {
      title: '感情分析',
      overall: '全体的な感情',
      positive: 'ポジティブ',
      negative: 'ネガティブ',
      neutral: '中立'
    },
    sections: {
      satisfaction: '顧客満足度',
      competition: '競合分析',
      painPoints: '課題点',
      positiveAspects: '良い点',
      actions: 'アクション項目',
      immediateActions: '即時アクション',
      longTermActions: '長期的な推奨事項',
      productFeedback: '製品フィードバック'
    },
    executive: {
      title: '要約'
    },
    errors: {
      empty: 'テキストを入力してください',
      parse: '分析結果の解析に失敗しました。もう一度お試しください。',
      api: 'テキストの分析に失敗しました。APIキーを確認してください。',
      debug: 'デバッグ情報を表示'
    },
    examples: '例を試す',
    satisfaction: {
      analysis: '満足度分析',
      criticalConcern: '重大な懸念',
      needsImprovement: '改善が必要',
      satisfactory: '満足',
      excellent: '優良',
      strongMessage: "顧客満足度が高く、製品とサービスの提供が効果的に行われていることを示しています。高水準を維持しながら、期待を超える機会を探してください。",
      moderateMessage: "満足度は中程度で、改善の余地があります。特定された課題点に対処し、良い点を強化することに注力してください。",
      lowMessage: "満足度が低く、即時の対応が必要です。重要な問題に優先的に対処し、顧客フィードバックを実装してください。",
      painPoints: '課題点',
      positiveAspects: '良い点',
      actionItems: 'アクション項目',
      identifiedIssues: '特定された問題',
      strengths: '強み',
      recommendations: '推奨事項'
    }
  }
} as const;

const languages = {
  en: 'English',
  ja: '日本語'
} as const;

const exampleTexts = {
  en: [
    {
      label: "Product Feedback with Feature Request",
      text: "The new dashboard interface is much cleaner and more intuitive than before. However, we're missing crucial export functionality - specifically the ability to export reports in PDF format. This is essential for our monthly client presentations. Also, the real-time analytics feature sometimes lags during peak hours (around 2-3 PM EST). Despite these issues, the new data visualization tools have helped us reduce report preparation time by approximately 40%."
    },
    {
      label: "Customer Service Experience",
      text: "Called customer support regarding our enterprise subscription issues. Was on hold for 45 minutes before speaking to someone. The representative, Sarah, was knowledgeable but had to escalate to a supervisor due to system limitations. This is the third time this month we've had billing discrepancies. As a company spending $50K annually on your services, this level of support is unacceptable. Considering evaluating other vendors like ServiceNow and Zendesk."
    },
    {
      label: "Product Implementation Review",
      text: "Implementation of the CRM system took 3 months longer than promised, causing significant delays in our Q3 rollout. The integration team was responsive, but the API documentation was outdated, and we had to rebuild several custom connectors. On the positive side, now that it's running, we've seen a 60% improvement in lead tracking efficiency and a 25% increase in sales team productivity. The mobile app is particularly impressive, though it needs better offline capabilities."
    },
    {
      label: "Market Competitive Analysis",
      text: "Compared to Salesforce and HubSpot, your pricing is competitive, but your feature set is lacking in key areas. Your AI capabilities are impressive and about 20% faster than competitors, but you're missing essential marketing automation tools that both Marketo and Mailchimp offer out of the box. Our team loves the UI, but enterprise-grade security features like SSO and role-based access control should be standard at this price point, not premium add-ons."
    }
  ],
  ja: [
    {
      label: "製品フィードバックと機能リクエスト",
      text: "新しいダッシュボードのインターフェースは以前より整理されており、より直感的になりました。しかし、重要なエクスポート機能、特にPDF形式でのレポート出力機能が欠けています。これは月次クライアントプレゼンテーションに不可欠です。また、リアルタイム分析機能はピーク時（EST午後2-3時頃）に遅延することがあります。これらの問題はありますが、新しいデータ可視化ツールのおかげでレポート作成時間が約40%削減されました。"
    },
    {
      label: "カスタマーサービス体験",
      text: "エンタープライズサブスクリプションの問題について、カスタマーサポートに電話しました。誰かと話すまでに45分待たされました。担当者のサラは知識が豊富でしたが、システムの制限により上司に問題をエスカレーションする必要がありました。今月だけで3回目の請求の不一致です。年間5000万円のサービス利用企業として、このレベルのサポートは受け入れられません。ServiceNowやZendeskなど、他のベンダーの評価を検討しています。"
    },
    {
      label: "製品導入レビュー",
      text: "CRMシステムの導入が約束より3ヶ月長くかかり、第3四半期の展開に大幅な遅れが生じました。インテグレーションチームの対応は早かったものの、APIドキュメントが古く、複数のカスタムコネクタを再構築する必要がありました。良い点として、稼働後はリード追跡の効率が60%向上し、営業チームの生産性が25%向上しました。モバイルアプリは特に印象的ですが、オフライン機能の改善が必要です。"
    },
    {
      label: "市場競争分析",
      text: "SalesforceやHubSpotと比較すると、価格は競争力がありますが、主要な機能面で不足があります。AI機能は印象的で、競合より約20%速いですが、MarketoやMailchimpが標準で提供しているような必須のマーケティング自動化ツールが欠けています。チームはUIを気に入っていますが、SSOやロールベースのアクセス制御などのエンタープライズグレードのセキュリティ機能は、この価格帯では標準機能であるべきで、プレミアムアドオンにすべきではありません。"
    }
  ]
} as const;

// Debounce function
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<number>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

function App() {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Memoize translations to prevent unnecessary re-renders
  const t = useMemo(() => translations[language], [language]);

  // Memoize language instructions
  const languageInstructions = useMemo(() => {
    return language === 'ja' 
      ? `Output Language: Japanese (日本語)
Important:
- Analyze the input text (which can be in any language)
- Provide ALL response text in Japanese
- This includes the executive summary, insights, and all text fields
- Use natural, professional Japanese language
- Keep technical terms that shouldn't be translated (e.g., product names)
- Return a clean JSON without any comments`
      : `Output Language: English
Important:
- Analyze the input text (which can be in any language)
- Provide ALL response text in English
- This includes the executive summary, insights, and all text fields
- Use natural, professional English language
- Keep technical terms that shouldn't be translated (e.g., product names)
- Return a clean JSON without any comments`;
  }, [language]);

  // Memoize the model instance
  const model = useMemo(() => genAI.getGenerativeModel({ model: "gemini-pro" }), []);

  // Debounced text input handler
  const handleInputChange = useDebounce((value: string) => {
    setInputText(value);
  }, DEBOUNCE_DELAY);

  // Memoize analysis function
  const analyzeText = useCallback(async () => {
    if (!inputText.trim()) {
      setError(t.errors.empty);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRawResponse(null);

    try {
      const prompt = `${languageInstructions}\n\n${PROMPTS.ANALYSIS}\n\nText to analyze: "${inputText}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setRawResponse(text);
      
      try {
        const cleanedText = text
          .replace(/^```json\n?/, '')
          .replace(/\n?```$/, '')
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
          .replace(/,(\s*[}\]])/g, '$1')
          .trim();
        
        const analysisResult = JSON.parse(cleanedText);
        
        if (!analysisResult.sentiment_analysis || !analysisResult.business_insights) {
          throw new Error('Missing required fields in analysis result');
        }
        
        setAnalysis(analysisResult);
      } catch (e) {
        console.error('Parse error:', e);
        console.log('Raw response:', text);
        setError(t.errors.parse);
      }
    } catch (e) {
      console.error('API error:', e);
      setError(t.errors.api);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, languageInstructions, model, t.errors]);

  // Memoize render functions
  const renderSentimentSection = useCallback(() => {
    if (!analysis?.sentiment_analysis) return null;
    const { overall_sentiment, sentiment_score, key_sentiments } = analysis.sentiment_analysis;
    return (
      <div className="analysis-section">
        <h3>{t.sentiment.title}</h3>
        <div className="sentiment-score">
          <div className="score-indicator" style={{
            backgroundColor: sentiment_score > 0 ? '#4CAF50' : sentiment_score < 0 ? '#f44336' : '#9e9e9e',
            width: `${Math.abs(sentiment_score * 100)}%`
          }}></div>
          <span>{(sentiment_score * 100).toFixed(1)}%</span>
        </div>
        <p><strong>{t.sentiment.overall}:</strong> {
          overall_sentiment === 'positive' ? t.sentiment.positive :
          overall_sentiment === 'negative' ? t.sentiment.negative :
          t.sentiment.neutral
        }</p>
        <div className="tags">
          {key_sentiments.map((sentiment, i) => (
            <span key={i} className="tag">{sentiment}</span>
          ))}
        </div>
      </div>
    );
  }, [analysis?.sentiment_analysis, t.sentiment]);

  const renderBusinessInsights = useCallback(() => {
    if (!analysis?.business_insights) return null;
    const { customer_satisfaction_indicators, action_items, market_intelligence } = analysis.business_insights;
    
    return (
      <div className="analysis-section business-insights">
        <h3>{t.sections.satisfaction}</h3>
        
        {/* Satisfaction Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>{t.sections.satisfaction}</h4>
            <div className="satisfaction-meter">
              <div className="meter-fill" style={{
                width: `${customer_satisfaction_indicators.satisfaction_level}%`,
                background: `linear-gradient(90deg, 
                  ${customer_satisfaction_indicators.satisfaction_level > 70 ? '#4CAF50' :
                    customer_satisfaction_indicators.satisfaction_level > 40 ? '#FF9800' : '#f44336'} 0%,
                  ${customer_satisfaction_indicators.satisfaction_level > 70 ? '#45a049' :
                    customer_satisfaction_indicators.satisfaction_level > 40 ? '#F57C00' : '#d32f2f'} 100%)`
              }}></div>
              <span>{customer_satisfaction_indicators.satisfaction_level}%</span>
            </div>
          </div>

          {/* Market Intelligence */}
          {market_intelligence.mentioned_competitors.length > 0 && (
            <div className="metric-card">
              <h4>{t.sections.competition}</h4>
              <div className="competitor-tags">
                {market_intelligence.mentioned_competitors.map((competitor, i) => (
                  <span key={i} className="competitor-tag">{competitor}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Points Analysis */}
        <div className="key-points-grid">
          {customer_satisfaction_indicators.pain_points.length > 0 && (
            <div className="points-card negative">
              <h4>{t.sections.painPoints}</h4>
              <ul>
                {customer_satisfaction_indicators.pain_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {customer_satisfaction_indicators.positive_aspects.length > 0 && (
            <div className="points-card positive">
              <h4>{t.sections.positiveAspects}</h4>
              <ul>
                {customer_satisfaction_indicators.positive_aspects.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Items */}
        {(action_items.immediate_actions.length > 0 || action_items.long_term_recommendations.length > 0) && (
          <div className="action-items-section">
            <h4>{t.sections.actions}</h4>
            <div className="action-items-grid">
              {action_items.immediate_actions.length > 0 && (
                <div className="action-card immediate">
                  <h5>{t.sections.immediateActions}</h5>
                  <ul>
                    {action_items.immediate_actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              {action_items.long_term_recommendations.length > 0 && (
                <div className="action-card long-term">
                  <h5>{t.sections.longTermActions}</h5>
                  <ul>
                    {action_items.long_term_recommendations.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Feedback */}
        {market_intelligence.product_feedback.length > 0 && (
          <div className="product-feedback">
            <h4>{t.sections.productFeedback}</h4>
            <ul>
              {market_intelligence.product_feedback.map((feedback, i) => (
                <li key={i}>{feedback}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }, [analysis?.business_insights, t.sections]);

  // Memoize dropdown handler
  const handleLanguageChange = useCallback((code: 'en' | 'ja') => {
    setLanguage(code);
    setIsLangDropdownOpen(false);
  }, []);

  const handleExampleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedExample = exampleTexts[language].find(
      example => example.label === event.target.value
    );
    if (selectedExample) {
      setInputText(selectedExample.text);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="language-selector">
          <button 
            className="language-dropdown-button"
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          >
            {languages[language]}
            <svg 
              className={`dropdown-arrow ${isLangDropdownOpen ? 'open' : ''}`}
              width="10" 
              height="6" 
              viewBox="0 0 10 6" 
              fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {isLangDropdownOpen && (
            <div className="language-dropdown">
              {Object.entries(languages).map(([code, name]) => (
                <button
                  key={code}
                  className={`language-option ${language === code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(code as 'en' | 'ja')}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <main>
        <div className="input-section">
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t.placeholder}
            rows={6}
          />
          <select 
            onChange={handleExampleSelect}
            className="examples-dropdown"
            value=""
          >
            <option value="" disabled>{t.examples}</option>
            {exampleTexts[language].map((example, index) => (
              <option key={index} value={example.label}>
                {example.label}
              </option>
            ))}
          </select>
          <button 
            onClick={analyzeText}
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? t.analyzing : t.analyze}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            {rawResponse && (
              <details>
                <summary>{t.errors.debug}</summary>
                <pre className="debug-info">{rawResponse}</pre>
              </details>
            )}
          </div>
        )}

        {analysis && (
          <div className="analysis-results">
            {/* Executive Summary - First and prominent */}
            <div className="analysis-section executive-summary">
              <h3>{t.executive.title}</h3>
              <p>{analysis.executive_summary}</p>
            </div>

            {/* Sentiment Analysis */}
            <div className="analysis-section sentiment-analysis">
              <h3>{t.sentiment.title}</h3>
              <div className="sentiment-score">
                <div className="score-indicator" style={{
                  backgroundColor: analysis.sentiment_analysis.sentiment_score > 0 ? '#4CAF50' : 
                                 analysis.sentiment_analysis.sentiment_score < 0 ? '#f44336' : '#9e9e9e',
                  width: `${Math.abs(analysis.sentiment_analysis.sentiment_score * 100)}%`
                }}></div>
                <span>{(analysis.sentiment_analysis.sentiment_score * 100).toFixed(1)}%</span>
              </div>
              <p><strong>{t.sentiment.overall}:</strong> {
                analysis.sentiment_analysis.overall_sentiment === 'positive' ? t.sentiment.positive :
                analysis.sentiment_analysis.overall_sentiment === 'negative' ? t.sentiment.negative :
                t.sentiment.neutral
              }</p>
              <div className="tags">
                {analysis.sentiment_analysis.key_sentiments.map((sentiment, i) => (
                  <span key={i} className="tag">{sentiment}</span>
                ))}
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="analysis-section satisfaction-section">
              <h3>{t.sections.satisfaction}</h3>
              <div className="satisfaction-meter">
                <div className="meter-fill" style={{
                  width: `${analysis.business_insights.customer_satisfaction_indicators.satisfaction_level}%`,
                  background: `linear-gradient(90deg, 
                    ${analysis.business_insights.customer_satisfaction_indicators.satisfaction_level > 70 ? '#4CAF50' :
                      analysis.business_insights.customer_satisfaction_indicators.satisfaction_level > 40 ? '#FF9800' : '#f44336'} 0%,
                    ${analysis.business_insights.customer_satisfaction_indicators.satisfaction_level > 70 ? '#45a049' :
                      analysis.business_insights.customer_satisfaction_indicators.satisfaction_level > 40 ? '#F57C00' : '#d32f2f'} 100%)`
                }}></div>
                <span>{analysis.business_insights.customer_satisfaction_indicators.satisfaction_level}%</span>
              </div>
              <div className="satisfaction-level-labels">
                <span>{t.satisfaction.criticalConcern}</span>
                <span>{t.satisfaction.needsImprovement}</span>
                <span>{t.satisfaction.satisfactory}</span>
                <span>{t.satisfaction.excellent}</span>
              </div>
              
              <div className="satisfaction-context">
                <h4>{t.satisfaction.analysis}</h4>
                <p>
                  {analysis.business_insights.customer_satisfaction_indicators.satisfaction_level > 70
                    ? t.satisfaction.strongMessage
                    : analysis.business_insights.customer_satisfaction_indicators.satisfaction_level > 40
                    ? t.satisfaction.moderateMessage
                    : t.satisfaction.lowMessage}
                </p>
                
                <div className="satisfaction-indicators">
                  <div className="satisfaction-indicator">
                    <h5>{t.satisfaction.painPoints}</h5>
                    <div className="value">{analysis.business_insights.customer_satisfaction_indicators.pain_points.length}</div>
                    <div className="satisfaction-trend trend-down">
                      {t.satisfaction.identifiedIssues}
                    </div>
                  </div>
                  
                  <div className="satisfaction-indicator">
                    <h5>{t.satisfaction.positiveAspects}</h5>
                    <div className="value">{analysis.business_insights.customer_satisfaction_indicators.positive_aspects.length}</div>
                    <div className="satisfaction-trend trend-up">
                      {t.satisfaction.strengths}
                    </div>
                  </div>
                  
                  <div className="satisfaction-indicator">
                    <h5>{t.satisfaction.actionItems}</h5>
                    <div className="value">{
                      analysis.business_insights.action_items.immediate_actions.length +
                      analysis.business_insights.action_items.long_term_recommendations.length
                    }</div>
                    <div className="satisfaction-trend trend-neutral">
                      {t.satisfaction.recommendations}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitive Analysis */}
            {analysis.business_insights.market_intelligence.mentioned_competitors.length > 0 && (
              <div className="analysis-section competition-section">
                <h3>{t.sections.competition}</h3>
                <div className="competitor-tags">
                  {analysis.business_insights.market_intelligence.mentioned_competitors.map((competitor, i) => (
                    <span key={i} className="competitor-tag">{competitor}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Pain Points and Positive Aspects */}
            <div className="analysis-section key-points-section">
              {analysis.business_insights.customer_satisfaction_indicators.pain_points.length > 0 && (
                <div className="points-card negative">
                  <h4>{t.sections.painPoints}</h4>
                  <ul>
                    {analysis.business_insights.customer_satisfaction_indicators.pain_points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.business_insights.customer_satisfaction_indicators.positive_aspects.length > 0 && (
                <div className="points-card positive">
                  <h4>{t.sections.positiveAspects}</h4>
                  <ul>
                    {analysis.business_insights.customer_satisfaction_indicators.positive_aspects.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Items */}
            {(analysis.business_insights.action_items.immediate_actions.length > 0 || 
              analysis.business_insights.action_items.long_term_recommendations.length > 0) && (
              <div className="analysis-section action-items-section">
                <h3>{t.sections.actions}</h3>
                <div className="action-items-grid">
                  {analysis.business_insights.action_items.immediate_actions.length > 0 && (
                    <div className="action-card immediate">
                      <h5>{t.sections.immediateActions}</h5>
                      <ul>
                        {analysis.business_insights.action_items.immediate_actions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.business_insights.action_items.long_term_recommendations.length > 0 && (
                    <div className="action-card long-term">
                      <h5>{t.sections.longTermActions}</h5>
                      <ul>
                        {analysis.business_insights.action_items.long_term_recommendations.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Feedback */}
            {analysis.business_insights.market_intelligence.product_feedback.length > 0 && (
              <div className="analysis-section product-feedback-section">
                <h3>{t.sections.productFeedback}</h3>
                <ul>
                  {analysis.business_insights.market_intelligence.product_feedback.map((feedback, i) => (
                    <li key={i}>{feedback}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
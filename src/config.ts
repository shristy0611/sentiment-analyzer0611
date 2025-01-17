// API configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const PROMPTS = {
  ANALYSIS: `You are a sophisticated business intelligence analyzer. Analyze the provided text and return a detailed analysis in a clean JSON format.

STRICT LANGUAGE REQUIREMENTS:
- If output language is English:
  * ALL text fields MUST be in English
  * Translate any non-English insights to English
  * Keep product names and technical terms in their original form
  * Use professional business English

- If output language is Japanese:
  * ALL text fields MUST be in Japanese
  * Translate any non-Japanese insights to Japanese
  * Keep product names and technical terms in their original form
  * Use professional business Japanese (敬語 where appropriate)

Return a JSON object with the following structure:
{
  "sentiment_analysis": {
    "overall_sentiment": "positive|negative|neutral",
    "sentiment_score": number (-1 to 1),
    "key_sentiments": string[]
  },
  "business_insights": {
    "customer_satisfaction_indicators": {
      "satisfaction_level": number (0-100),
      "pain_points": string[],
      "positive_aspects": string[]
    },
    "action_items": {
      "immediate_actions": string[],
      "long_term_recommendations": string[]
    },
    "market_intelligence": {
      "mentioned_competitors": string[],
      "product_feedback": string[],
      "feature_requests": string[]
    }
  },
  "executive_summary": string
}`
};

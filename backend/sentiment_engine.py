from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

class SentimentAnalyzer:
    def __init__(self):
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    async def analyze_sentiment(self, text: str):
        response = await self.groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are an advanced sentiment analysis AI. 
                    Analyze the text and provide a JSON response with:
                    1. Overall Sentiment (positive/negative/neutral)
                    2. Emotion Detected (e.g., happy, sad, angry, etc.)
                    3. Confidence Score (0-100%)
                    4. Key Insights (brief explanation)
                    
                    Format your response as a valid JSON object with these exact keys:
                    {
                        "sentiment": string,
                        "emotion": string,
                        "confidence": number,
                        "explanation": string
                    }
                    """
                },
                {"role": "user", "content": text}
            ],
            max_tokens=250,
            temperature=0
        )
        
        return self._parse_sentiment_response(response.choices[0].message.content)
    
    def _parse_sentiment_response(self, response: str) -> dict:
        try:
            # The response should already be in JSON format
            import json
            result = json.loads(response)
            
            # Ensure all required fields are present
            required_fields = ['sentiment', 'emotion', 'confidence', 'explanation']
            if not all(field in result for field in required_fields):
                raise ValueError("Missing required fields in response")
                
            return result
        except Exception as e:
            print(f"Error parsing response: {e}")
            # Return a default response if parsing fails
            return {
                "sentiment": "neutral",
                "emotion": "unknown",
                "confidence": 0,
                "explanation": "Failed to analyze sentiment"
            }

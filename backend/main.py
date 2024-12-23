from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from groq.client import Groq
from dotenv import load_dotenv
import json
from datetime import datetime
from typing import Dict, Optional

# Load environment variables
load_dotenv()

app = FastAPI()

# Get CORS origins from environment variable
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class TextAnalysisRequest(BaseModel):
    text: str
    nickname: str

class UserSession(BaseModel):
    nickname: str

class DemoTokenManager:
    MAX_TOKENS = 10
    
    def __init__(self):
        self.tokens_used = 0
    
    def can_analyze(self):
        return self.tokens_used < self.MAX_TOKENS
    
    def use_token(self):
        if self.can_analyze():
            self.tokens_used += 1
            return True
        return False

    def get_remaining_tokens(self):
        return self.MAX_TOKENS - self.tokens_used

# Store user sessions and their token managers
user_sessions: Dict[str, DemoTokenManager] = {}

def get_user_token_manager(nickname: str) -> DemoTokenManager:
    if nickname not in user_sessions:
        user_sessions[nickname] = DemoTokenManager()
    return user_sessions[nickname]

LANGUAGE_DETECTION_PROMPT = """You are a language detection expert. Analyze the given text and return ONLY a JSON object with the detected language information. The response should be in this exact format:

{
    "language_code": "en",  // ISO 639-1 code (e.g., en, ja, es, fr)
    "language_name": "English",  // Full name in English
    "native_name": "English",    // Name in the detected language
    "confidence": 0.95,          // Confidence score between 0 and 1
    "direction": "ltr"           // Text direction: "ltr" or "rtl"
}

Return ONLY the JSON object, no other text or explanations."""

ANALYSIS_PROMPT = """You are a multilingual sentiment analysis expert. Analyze the text in the specified language and provide your analysis in that SAME language. The input language details are provided.

Return the analysis in this exact JSON structure:

{
    "emotional_analysis": {
        "primary_emotion": "primary emotion in detected language",
        "secondary_emotions": ["emotion1", "emotion2"],
        "emotional_intensity": 0.75,  // 0-1 scale
        "emotional_stability": 0.8,   // 0-1 scale
        "valence": 0.6               // 0-1 scale
    },
    "psychological_insights": {
        "mindset": "mindset description in detected language",
        "cognitive_patterns": ["pattern1", "pattern2"],
        "motivations": ["motivation1", "motivation2"],
        "rationality_score": 0.85,
        "cognitive_biases": ["bias1", "bias2"]
    },
    "risk_assessment": {
        "risk_level": 0.3,
        "red_flags": ["flag1", "flag2"],
        "urgency": 0.4
    },
    "summary": "Analysis summary in detected language"
}

IMPORTANT:
1. All numeric values MUST be between 0 and 1
2. Return ONLY the JSON object, no other text
3. Ensure the JSON is properly formatted and valid
4. ALL text fields MUST be in the detected language
5. Do not add any explanations or markdown formatting
"""

@app.post("/api/register")
async def register_user(user: UserSession):
    if not user.nickname.strip():
        raise HTTPException(status_code=400, detail="Nickname cannot be empty")
    
    # Create a new session if user doesn't exist
    if user.nickname not in user_sessions:
        user_sessions[user.nickname] = DemoTokenManager()
        return {"message": f"Welcome {user.nickname}! You have {DemoTokenManager.MAX_TOKENS} tokens to use."}
    
    # Return existing session info if user exists
    token_manager = user_sessions[user.nickname]
    remaining_tokens = token_manager.get_remaining_tokens()
    return {"message": f"Welcome back {user.nickname}! You have {remaining_tokens} tokens remaining."}

@app.get("/api/tokens/{nickname}")
async def get_tokens(nickname: str):
    token_manager = get_user_token_manager(nickname)
    remaining_tokens = token_manager.get_remaining_tokens()
    return {"remaining_tokens": remaining_tokens}

# Simple JSON storage
STORAGE_FILE = "sentiment_data.json"

def save_analysis(text: str, analysis: dict):
    try:
        if os.path.exists(STORAGE_FILE):
            with open(STORAGE_FILE, 'r') as f:
                data = json.load(f)
        else:
            data = []
        
        entry = {
            'id': len(data) + 1,
            'text': text,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat()
        }
        data.append(entry)
        
        with open(STORAGE_FILE, 'w') as f:
            json.dump(data, f, indent=2)
            
        return entry
    except Exception as e:
        print(f"Error saving analysis: {e}")
        return None

def get_recent_analyses(limit: int = 5):
    try:
        if os.path.exists(STORAGE_FILE):
            with open(STORAGE_FILE, 'r') as f:
                data = json.load(f)
            return sorted(data, key=lambda x: x['timestamp'], reverse=True)[:limit]
        return []
    except Exception as e:
        print(f"Error reading analyses: {e}")
        return []

@app.post("/api/analyze-sentiment")
async def analyze_sentiment(request: TextAnalysisRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    # Get or create token manager for user
    token_manager = get_user_token_manager(request.nickname)
    
    # Check if user has tokens available
    if not token_manager.can_analyze():
        raise HTTPException(
            status_code=403,
            detail=f"No tokens remaining. Maximum {DemoTokenManager.MAX_TOKENS} analyses allowed in demo mode."
        )

    try:
        # First, detect the language
        language_detection = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": LANGUAGE_DETECTION_PROMPT
                },
                {"role": "user", "content": f"Detect language of this text: {request.text}"}
            ],
            max_tokens=200,
            temperature=0.1
        )

        try:
            lang_response = language_detection.choices[0].message.content.strip()
            lang_response = lang_response.replace("```json", "").replace("```", "").strip()
            language_info = json.loads(lang_response)

            # Validate language detection response
            required_lang_fields = ["language_code", "language_name", "native_name", "confidence", "direction"]
            if not all(field in language_info for field in required_lang_fields):
                raise ValueError("Invalid language detection response")

        except (json.JSONDecodeError, ValueError) as e:
            print(f"Language detection error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to detect language. Please try again."
            )

        # Now perform sentiment analysis with language context
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": ANALYSIS_PROMPT
                },
                {
                    "role": "user",
                    "content": f"""Analyze this text in {language_info['native_name']} ({language_info['language_name']}):
                    
Text: {request.text}

Language Information:
- Code: {language_info['language_code']}
- Name: {language_info['language_name']}
- Native Name: {language_info['native_name']}
- Direction: {language_info['direction']}"""
                }
            ],
            max_tokens=1500,
            temperature=0.1
        )

        try:
            response_text = completion.choices[0].message.content.strip()
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            # Parse and validate the JSON structure
            result = json.loads(response_text)
            
            # Validate required fields
            required_fields = ["emotional_analysis", "psychological_insights", "risk_assessment", "summary"]
            if not all(field in result for field in required_fields):
                raise ValueError("Missing required fields in response")
            
            # Validate numeric ranges
            if not (0 <= result["emotional_analysis"]["emotional_intensity"] <= 1 and
                   0 <= result["emotional_analysis"]["emotional_stability"] <= 1 and
                   0 <= result["emotional_analysis"]["valence"] <= 1 and
                   0 <= result["psychological_insights"]["rationality_score"] <= 1 and
                   0 <= result["risk_assessment"]["risk_level"] <= 1 and
                   0 <= result["risk_assessment"]["urgency"] <= 1):
                raise ValueError("Numeric values must be between 0 and 1")
            
            # Add language information to the result
            result["language_info"] = language_info
            
            # Use a token only if analysis was successful
            token_manager.use_token()
            
            # Add token information to the response
            result["tokens_remaining"] = token_manager.get_remaining_tokens()
            
            # Save analysis
            save_analysis(request.text, result)
            return result
            
        except json.JSONDecodeError as e:
            print(f"Invalid JSON response: {response_text}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse AI response. Please try again."
            )
        except ValueError as e:
            print(f"Validation error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred. Please try again."
            )

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history():
    analyses = get_recent_analyses()
    
    if analyses:
        # Enhanced summary statistics
        summary = {
            "total_analyses": len(analyses),
            "risk_levels": {
                "high": sum(1 for a in analyses if a['analysis'].get('risk_assessment', {}).get('risk_level') > 0.5),
                "medium": sum(1 for a in analyses if a['analysis'].get('risk_assessment', {}).get('risk_level') > 0.2 and a['analysis'].get('risk_assessment', {}).get('risk_level') <= 0.5),
                "low": sum(1 for a in analyses if a['analysis'].get('risk_assessment', {}).get('risk_level') <= 0.2)
            },
            "common_emotions": {},
            "average_objectivity": 0,
            "frequent_cognitive_biases": {}
        }
        
        # Calculate averages and frequencies
        total_objectivity = 0
        emotions_count = {}
        biases_count = {}
        
        for analysis in analyses:
            if 'analysis' in analysis:
                # Count emotions
                for emotion in analysis['analysis'].get('emotional_analysis', {}).get('secondary_emotions', []):
                    emotions_count[emotion] = emotions_count.get(emotion, 0) + 1
                
                # Sum objectivity
                total_objectivity += analysis['analysis'].get('emotional_analysis', {}).get('emotional_stability', 0)
                
                # Count cognitive biases
                for bias in analysis['analysis'].get('psychological_insights', {}).get('cognitive_biases', []):
                    biases_count[bias] = biases_count.get(bias, 0) + 1
        
        # Calculate final statistics
        if analyses:
            summary["average_objectivity"] = total_objectivity / len(analyses)
            summary["common_emotions"] = dict(sorted(emotions_count.items(), key=lambda x: x[1], reverse=True)[:5])
            summary["frequent_cognitive_biases"] = dict(sorted(biases_count.items(), key=lambda x: x[1], reverse=True)[:5])
    else:
        summary = {
            "total_analyses": 0,
            "risk_levels": {"high": 0, "medium": 0, "low": 0},
            "common_emotions": {},
            "average_objectivity": 0,
            "frequent_cognitive_biases": {}
        }
    
    return {
        "analyses": analyses,
        "summary": summary
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

import json
from datetime import datetime
import os
from typing import Dict, List, Any

class LocalSentimentDatabase:
    def __init__(self, file_path: str = 'sentiment_data.json'):
        self.file_path = file_path
        self.ensure_file_exists()
    
    def ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump([], f)
    
    def save_analysis(self, input_text: str, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        with open(self.file_path, 'r+') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
            
            new_entry = {
                'id': len(data) + 1,
                'text': input_text,
                'analysis': analysis_result,
                'timestamp': datetime.now().isoformat()
            }
            data.append(new_entry)
            
            # Reset file pointer and write updated data
            f.seek(0)
            f.truncate()
            json.dump(data, f, indent=4)
            
        return new_entry
    
    def get_all_analyses(self) -> List[Dict[str, Any]]:
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def get_sentiment_summary(self) -> Dict[str, Any]:
        analyses = self.get_all_analyses()
        
        if not analyses:
            return {
                'total_analyses': 0,
                'sentiment_breakdown': {
                    'positive': 0,
                    'negative': 0,
                    'neutral': 0
                },
                'average_confidence': 0
            }
        
        sentiment_counts = {
            'positive': sum(1 for a in analyses if a['analysis']['sentiment'] == 'positive'),
            'negative': sum(1 for a in analyses if a['analysis']['sentiment'] == 'negative'),
            'neutral': sum(1 for a in analyses if a['analysis']['sentiment'] == 'neutral')
        }
        
        total_confidence = sum(a['analysis'].get('confidence', 0) for a in analyses)
        average_confidence = total_confidence / len(analyses) if analyses else 0
        
        return {
            'total_analyses': len(analyses),
            'sentiment_breakdown': sentiment_counts,
            'average_confidence': round(average_confidence, 2)
        }
    
    def get_recent_analyses(self, limit: int = 5) -> List[Dict[str, Any]]:
        analyses = self.get_all_analyses()
        return sorted(analyses, key=lambda x: x['timestamp'], reverse=True)[:limit]

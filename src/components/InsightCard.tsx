import React from 'react';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';
import { Brain, Lightbulb, Scale } from 'lucide-react';

interface InsightCardProps {
  insights: {
    mindset: string;
    cognitive_patterns: string[];
    motivations: string[];
    rationality_score: number;
    cognitive_biases: string[];
  };
}

export function InsightCard({ insights }: InsightCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mindset Analysis</h3>
          <p className="text-gray-700">{insights.mindset}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cognitive Patterns</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {insights.cognitive_patterns.map((pattern, index) => (
              <li key={index}>{pattern}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Motivations</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {insights.motivations.map((motivation, index) => (
              <li key={index}>{motivation}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cognitive Score</h4>
          <div className="text-3xl font-bold text-indigo-600">
            {Math.round(insights.rationality_score * 100)}%
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Potential Biases</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {insights.cognitive_biases.map((bias, index) => (
              <li key={index}>{bias}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface EmotionRadarProps {
  analysis: {
    primary_emotion: string;
    secondary_emotions: string[];
    emotional_intensity: number;
    emotional_stability: number;
    valence: number;
  };
}

export function EmotionRadar({ analysis }: EmotionRadarProps) {
  const chartData = [
    {
      subject: 'Emotional Intensity',
      value: analysis.emotional_intensity,
    },
    {
      subject: 'Emotional Stability',
      value: analysis.emotional_stability,
    },
    {
      subject: 'Valence',
      value: analysis.valence,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Emotion</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {analysis.primary_emotion}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Secondary Emotions</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.secondary_emotions.map((emotion, index) => (
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
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Emotional Intensity: </span>
                <span className="text-lg font-semibold text-indigo-600">{Math.round(analysis.emotional_intensity * 100)}%</span>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Emotional Stability: </span>
                <span className="text-lg font-semibold text-indigo-600">{Math.round(analysis.emotional_stability * 100)}%</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Valence: </span>
                <span className="text-lg font-semibold text-indigo-600">{Math.round(analysis.valence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

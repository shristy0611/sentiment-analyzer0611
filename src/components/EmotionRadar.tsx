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
  data: {
    intensity: number;
    stability: number;
    valence: number;
  };
  translations: {
    intensity: string;
    stability: string;
    valence: string;
  };
}

export const EmotionRadar: React.FC<EmotionRadarProps> = ({ data, translations }) => {
  const chartData = [
    {
      subject: translations.intensity,
      value: data.intensity,
    },
    {
      subject: translations.stability,
      value: data.stability,
    },
    {
      subject: translations.valence,
      value: data.valence,
    },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 1]} />
          <Radar
            name="Emotions"
            dataKey="value"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

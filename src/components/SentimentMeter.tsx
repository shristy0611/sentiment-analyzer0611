import React from 'react';

interface SentimentMeterProps {
  confidence: number;
  sentiment: string;
}

export function SentimentMeter({ confidence, sentiment }: SentimentMeterProps) {
  // Convert confidence to a color
  const getColor = () => {
    if (sentiment === 'positive') return 'bg-green-500';
    if (sentiment === 'negative') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="w-full space-y-2">
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <div className="text-sm text-center text-gray-600">
        Confidence: {confidence}%
      </div>
    </div>
  );
}
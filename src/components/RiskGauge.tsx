import React from 'react';

interface RiskGaugeProps {
  assessment: {
    risk_level: number;
    red_flags: string[];
    urgency: number;
  };
}

export function RiskGauge({ assessment }: RiskGaugeProps) {
  const getRiskColor = (level: number) => {
    if (level < 0.3) return 'text-green-600';
    if (level < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLabel = (level: number) => {
    if (level < 0.3) return 'Low Risk';
    if (level < 0.7) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Level</h3>
        <div className={`text-5xl font-bold ${getRiskColor(assessment.risk_level)} mb-2`}>
          {Math.round(assessment.risk_level * 100)}%
        </div>
        <div className="text-sm font-medium text-gray-600">
          {getRiskLabel(assessment.risk_level)}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Red Flags</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {assessment.red_flags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Urgency Level</h4>
          <div className="text-3xl font-bold text-indigo-600">
            {Math.round(assessment.urgency * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

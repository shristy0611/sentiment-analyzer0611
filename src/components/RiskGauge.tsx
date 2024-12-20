import React from 'react';

interface RiskGaugeProps {
  riskLevel: number;
  translations: {
    lowRisk: string;
    mediumRisk: string;
    highRisk: string;
    riskLevel: string;
  };
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ riskLevel, translations }) => {
  const percentage = riskLevel * 100;

  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return 'text-green-500';
    if (risk < 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScaleColor = (risk: number) => {
    if (risk < 0.3) return 'bg-gradient-to-r from-green-200 to-green-500';
    if (risk < 0.7) return 'bg-gradient-to-r from-yellow-200 to-yellow-500';
    return 'bg-gradient-to-r from-red-200 to-red-500';
  };

  const getRiskText = (risk: number) => {
    if (risk < 0.3) return translations.lowRisk;
    if (risk < 0.7) return translations.mediumRisk;
    return translations.highRisk;
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.riskLevel}</h3>
      <div className={`text-4xl font-bold mb-2 ${getRiskColor(riskLevel)}`}>
        {getRiskText(riskLevel)}
      </div>
      <div className="text-gray-500 mb-4">{Math.round(percentage)}%</div>
      
      {/* Risk Scale */}
      <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 bg-gradient-to-r from-green-200 to-green-300" />
          <div className="w-1/3 bg-gradient-to-r from-yellow-200 to-yellow-300" />
          <div className="w-1/3 bg-gradient-to-r from-red-200 to-red-300" />
        </div>
        
        {/* Active indicator */}
        <div
          className={`absolute h-full transition-all duration-500 ${getScaleColor(riskLevel)}`}
          style={{ width: `${percentage}%` }}
        >
          <div 
            className="absolute right-0 top-0 h-full w-2 bg-white shadow-lg transform translate-x-1/2 rounded-full"
          />
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

import React from 'react';

interface LanguageInfoProps {
  languageInfo: {
    language_code: string;
    language_name: string;
    native_name: string;
    confidence: number;
    direction: string;
  };
  translations: {
    detectedLanguage: string;
    confidence: string;
    code: string;
    direction: string;
    leftToRight: string;
    rightToLeft: string;
  };
}

export const LanguageInfo: React.FC<LanguageInfoProps> = ({ languageInfo, translations }) => {
  const confidencePercentage = Math.round(languageInfo.confidence * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{translations.detectedLanguage}</h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-lg font-semibold">{languageInfo.native_name}</span>
            <span className="text-sm text-gray-500">({languageInfo.language_name})</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">{translations.confidence}</div>
          <div className="text-lg font-semibold text-indigo-600">{confidencePercentage}%</div>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
        <div>
          <span className="font-medium">{translations.code}:</span> {languageInfo.language_code}
        </div>
        <div>
          <span className="font-medium">{translations.direction}:</span>{' '}
          {languageInfo.direction === 'rtl' ? translations.rightToLeft : translations.leftToRight}
        </div>
      </div>
    </div>
  );
};

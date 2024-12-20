import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface TokenDisplayProps {
  remainingTokens: number;
  maxTokens: number;
  translations: {
    demoTokens: string;
    tokensRemaining: string;
  };
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ remainingTokens, maxTokens, translations }) => {
  const percentage = (remainingTokens / maxTokens) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium text-gray-900">{translations.demoTokens}</span>
        </div>
        <span className="text-sm font-medium text-amber-600">{remainingTokens} {translations.tokensRemaining}</span>
      </div>
      
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-amber-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
          />
        </div>
      </div>
      
      {remainingTokens === 0 && (
        <p className="mt-2 text-xs text-red-600">
          You've used all your demo tokens. Thank you for trying our service!
        </p>
      )}
    </div>
  );
}

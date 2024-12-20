import React from 'react';
import type { SentimentResult } from '../utils/types';
import { AlertTriangle } from 'lucide-react';

type AnalysisDetailsProps = {
  result: SentimentResult;
};

export function AnalysisDetails({ result }: AnalysisDetailsProps) {
  const showSarcasmWarning = result.details.sarcasmProbability && 
    result.details.sarcasmProbability > 0.5;

  return (
    <div className="space-y-4">
      {showSarcasmWarning && (
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">
            This text may contain sarcasm or irony 
            ({(result.details.sarcasmProbability! * 100).toFixed(0)}% probability)
          </span>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Words</h4>
        {result.details.positiveWords.length > 0 && (
          <div className="mb-2">
            <span className="text-sm font-medium text-green-600">Positive: </span>
            <span className="text-sm text-gray-600">
              {result.details.positiveWords.join(', ')}
            </span>
          </div>
        )}
        {result.details.negativeWords.length > 0 && (
          <div>
            <span className="text-sm font-medium text-red-600">Negative: </span>
            <span className="text-sm text-gray-600">
              {result.details.negativeWords.join(', ')}
            </span>
          </div>
        )}
      </div>

      {result.details.context && (
        <div className="text-sm text-gray-600">
          <h4 className="font-medium text-gray-700 mb-2">Context Analysis</h4>
          <ul className="space-y-1">
            {result.details.context.negations.length > 0 && (
              <li>Found negations: {result.details.context.negations.join(', ')}</li>
            )}
            {result.details.context.intensifiers.length > 0 && (
              <li>Found intensifiers: {result.details.context.intensifiers.join(', ')}</li>
            )}
            {result.details.context.hasContrastingClauses && (
              <li>Contains contrasting clauses</li>
            )}
            {result.details.context.hasEmphasis && (
              <li>Contains emphasized text</li>
            )}
          </ul>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Total words analyzed: {result.details.totalWords}
      </div>
    </div>
  );
}
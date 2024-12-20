import React from 'react';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';
import { Brain, Lightbulb, Scale } from 'lucide-react';

interface InsightCardProps {
  mindset: string;
  cognitivePatterns: string[];
  motivations: string[];
  rationalityScore: number;
  cognitiveBiases: string[];
}

export function InsightCard({
  mindset,
  cognitivePatterns,
  motivations,
  rationalityScore,
  cognitiveBiases,
}: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      {/* Mindset Section */}
      <div className="flex items-start space-x-4">
        <Brain className="w-6 h-6 text-indigo-500 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mindset Analysis</h3>
          <p className="text-gray-600 mt-1">{mindset}</p>
        </div>
      </div>

      {/* Rationality Score */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Rationality Score</span>
          <span className="text-sm font-medium text-gray-900">{rationalityScore}%</span>
        </div>
        <Progress.Root
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
          value={rationalityScore}
        >
          <Progress.Indicator
            className="h-full bg-indigo-500 transition-all duration-300 ease-in-out"
            style={{ width: `${rationalityScore}%` }}
          />
        </Progress.Root>
      </div>

      {/* Patterns and Motivations */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-medium text-gray-900">Cognitive Patterns</h4>
          </div>
          <ul className="space-y-1">
            {cognitivePatterns.map((pattern, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {pattern}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Scale className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-medium text-gray-900">Motivations</h4>
          </div>
          <ul className="space-y-1">
            {motivations.map((motivation, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {motivation}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cognitive Biases */}
      {cognitiveBiases.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Potential Cognitive Biases</h4>
          <div className="flex flex-wrap gap-2">
            {cognitiveBiases.map((bias, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {bias}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

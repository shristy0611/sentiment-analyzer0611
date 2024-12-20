import React from 'react';
import { motion } from 'framer-motion';

interface AgentInsight {
  name: string;
  role: string;
  expertise: string[];
  notes: string;
}

interface TeamInsightsProps {
  insights: {
    agent_observations: AgentInsight[];
    analysis_timestamp: string;
  };
}

export function TeamInsights({ insights }: TeamInsightsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Expert Analysis Team</h3>
        <span className="text-sm text-gray-500">
          {new Date(insights.analysis_timestamp).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.agent_observations.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-indigo-600">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900">{agent.name}</h4>
                <p className="text-sm text-indigo-600">{agent.role}</p>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {agent.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 italic">
                    "{agent.notes}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

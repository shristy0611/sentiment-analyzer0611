import { motion } from 'framer-motion';
import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import { RiRobot2Line } from 'react-icons/ri';
import { ScoreRing } from './ScoreRing';

interface AIDoctorProps {
  name: string;
  role: string;
  notes: string;
  expertise: string[];
  avatarColor: string;
  confidenceScore: number;
  insightScore: number;
  clarityScore: number;
}

export const AIDoctor = ({ 
  name, 
  role, 
  notes, 
  expertise, 
  avatarColor,
  confidenceScore,
  insightScore,
  clarityScore
}: AIDoctorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-100 h-[220px] flex flex-col"
    >
      <div className="flex items-start space-x-4 h-full">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Avatar.Root className="inline-flex items-center justify-center w-12 h-12 rounded-full">
                <Avatar.Fallback
                  className="flex items-center justify-center w-full h-full text-white text-xl"
                  style={{ backgroundColor: avatarColor }}
                >
                  <RiRobot2Line />
                </Avatar.Fallback>
              </Avatar.Root>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white px-3 py-2 rounded text-sm"
                sideOffset={5}
              >
                AI Specialist
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {role}
              </span>
            </div>
            <div className="flex space-x-4">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div>
                      <ScoreRing score={confidenceScore} color="#4F46E5" />
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-3 py-2 rounded text-sm"
                      sideOffset={5}
                    >
                      Confidence Score
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div>
                      <ScoreRing score={insightScore} color="#10B981" />
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-3 py-2 rounded text-sm"
                      sideOffset={5}
                    >
                      Insight Score
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div>
                      <ScoreRing score={clarityScore} color="#EC4899" />
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-3 py-2 rounded text-sm"
                      sideOffset={5}
                    >
                      Clarity Score
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>
          
          <div className="mt-2 text-gray-600 text-sm space-y-2">
            <p>{notes}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeTransitionProps {
  show: boolean;
  name: string;
  language: string;
  onComplete: () => void;
}

export const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({
  show,
  name,
  language,
  onComplete,
}) => {
  const getWelcomeText = (lang: string) => {
    switch (lang) {
      case 'ja':
        return 'ようこそ';
      default:
        return 'Welcome';
    }
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1]
            }}
            exit={{ 
              scale: 0.8,
              opacity: 0
            }}
            transition={{
              duration: 2,
              times: [0, 0.6, 1]
            }}
          >
            <motion.div
              className="text-7xl font-bold text-white mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {getWelcomeText(language)}
            </motion.div>
            <motion.div
              className="text-4xl text-white/90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {language === 'ja' ? `${name}さん` : name}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

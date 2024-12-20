import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CulturalNicknameInputProps {
  onSubmit: (nickname: string, detectedLanguage: string) => void;
}

interface WelcomeMessage {
  language: string;
  greeting: string;
  placeholder: string;
  direction: 'ltr' | 'rtl';
  welcomeText: string;
}

const welcomeMessages: WelcomeMessage[] = [
  {
    language: 'ja',
    greeting: 'センチメント分析へようこそ',
    placeholder: 'お名前を入力してください',
    direction: 'ltr',
    welcomeText: 'ようこそ'
  },
  {
    language: 'en',
    greeting: 'Welcome to Sentiment Analyzer',
    placeholder: 'Enter your name',
    direction: 'ltr',
    welcomeText: 'Welcome'
  }
];

export const CulturalNicknameInput: React.FC<CulturalNicknameInputProps> = ({ onSubmit }) => {
  const [nickname, setNickname] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [detectedCulture, setDetectedCulture] = useState<WelcomeMessage>(welcomeMessages[0]);

  useEffect(() => {
    if (!isTyping) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % welcomeMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  useEffect(() => {
    if (!isTyping) {
      setDetectedCulture(welcomeMessages[currentMessageIndex]);
    }
  }, [currentMessageIndex, isTyping]);

  const detectLanguage = (text: string): void => {
    setIsTyping(true);
    // Simple script detection based on Unicode ranges
    const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF]/.test(text);
    const hasChinese = /[\u4E00-\u9FFF]/.test(text);
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasPortuguese = /[À-ÿ]/.test(text);

    if (hasJapanese) {
      setDetectedCulture(welcomeMessages.find(m => m.language === 'ja')!);
    } else {
      setDetectedCulture(welcomeMessages.find(m => m.language === 'en')!);
    }
  };

  useEffect(() => {
    if (nickname) {
      detectLanguage(nickname);
    }
  }, [nickname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname, detectedCulture.language);
    }
  };

  const getHonorific = (name: string, language: string) => {
    switch (language) {
      case 'ja':
        return `${name}さん`;
      default:
        return name;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={detectedCulture.language}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-8"
          >
            <motion.div
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-2"
              style={{ direction: detectedCulture.direction }}
            >
              {detectedCulture.welcomeText}
            </motion.div>
            <motion.h2
              className="text-xl text-gray-600"
              style={{ direction: detectedCulture.direction }}
            >
              {detectedCulture.greeting}
            </motion.h2>
          </motion.div>
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <motion.input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              placeholder={detectedCulture.placeholder}
              style={{ direction: detectedCulture.direction }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </div>

          {nickname && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-gray-600 text-center"
            >
              {getHonorific(nickname, detectedCulture.language)}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: nickname ? 1 : 0.5 }}
            whileHover={{ scale: nickname ? 1.02 : 1 }}
            whileTap={{ scale: nickname ? 0.98 : 1 }}
            disabled={!nickname}
          >
            {detectedCulture.language === 'ja' ? '始めましょう' :
             detectedCulture.language === 'pt' ? 'Começar' :
             detectedCulture.language === 'ar' ? 'لنبدأ' :
             detectedCulture.language === 'ko' ? '시작하기' :
             detectedCulture.language === 'zh' ? '开始' :
             detectedCulture.language === 'hi' ? 'शुरू करें' :
             detectedCulture.language === 'es' ? 'Empezar' :
             'Let\'s Begin'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

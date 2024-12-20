import { stopwords } from './constants/words';

// Remove URLs from text
export function removeUrls(text: string): string {
  return text.replace(/https?:\/\/\S+/g, '');
}

// Remove emojis from text
export function removeEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
}

// Remove special characters and numbers
export function removeSpecialChars(text: string): string {
  return text.replace(/[^a-zA-Z\s]/g, ' ');
}

// Handle common contractions
export function expandContractions(text: string): string {
  const contractions: { [key: string]: string } = {
    "can't": "cannot",
    "won't": "will not",
    "n't": " not",
    "'re": " are",
    "'s": " is",
    "'d": " would",
    "'ll": " will",
    "'ve": " have",
    "'m": " am"
  };

  return Object.entries(contractions).reduce(
    (acc, [contraction, expansion]) => 
      acc.replace(new RegExp(contraction, 'gi'), expansion),
    text
  );
}

// Remove stopwords from text
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter(token => !stopwords.has(token.toLowerCase()));
}

// Tokenize text into words
export function tokenize(text: string): string[] {
  return text.toLowerCase()
    .split(/\s+/)
    .filter(token => token.length > 0);
}

// Simple word stemming (basic implementation)
export function stemWord(word: string): string {
  return word
    .replace(/ing$/, '')
    .replace(/ed$/, '')
    .replace(/s$/, '')
    .replace(/ly$/, '');
}

// Main preprocessing pipeline
export function preprocessText(text: string): string[] {
  const cleanText = removeUrls(text);
  const noEmojis = removeEmojis(cleanText);
  const noSpecialChars = removeSpecialChars(noEmojis);
  const expandedText = expandContractions(noSpecialChars);
  const tokens = tokenize(expandedText);
  const noStopwords = removeStopwords(tokens);
  return noStopwords.map(stemWord);
}
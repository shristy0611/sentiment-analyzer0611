// Negation patterns
export function findNegations(text: string): string[] {
  const negationWords = [
    'not', 'no', 'never', 'none', 'neither', 'nowhere', 'nothing',
    "isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't",
    "hadn't", "doesn't", "don't", "didn't", "won't", "wouldn't",
    "can't", "couldn't", "shouldn't", "mustn't", "without"
  ];

  return negationWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
}

// Intensifier patterns
export function findIntensifiers(text: string): string[] {
  const intensifiers = [
    'very', 'really', 'extremely', 'absolutely', 'completely',
    'totally', 'utterly', 'quite', 'particularly', 'especially',
    'remarkably', 'highly', 'incredibly', 'super', 'so'
  ];

  return intensifiers.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
}
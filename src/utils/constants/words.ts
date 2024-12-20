// Sentiment word lists
export const positiveWords = new Set([
  'good', 'great', 'awesome', 'excellent', 'happy', 'love', 'wonderful',
  'fantastic', 'amazing', 'positive', 'beautiful', 'perfect', 'best',
  'excited', 'joy', 'pleased', 'delighted', 'outstanding', 'brilliant',
  'superb', 'magnificent', 'marvelous', 'terrific', 'exceptional'
]);

export const negativeWords = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'sad', 'hate', 'poor',
  'disappointing', 'negative', 'worst', 'angry', 'upset', 'frustrated',
  'disappointed', 'unhappy', 'annoyed', 'dislike', 'terrible', 'awful',
  'miserable', 'pathetic', 'inferior', 'unpleasant', 'dreadful'
]);

// Common English stopwords
export const stopwords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
  'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
  'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to',
  'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
  'further', 'then', 'once'
]);
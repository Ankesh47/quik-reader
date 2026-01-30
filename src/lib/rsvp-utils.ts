export function getOptimalRecognitionPoint(word: string): number {
  if (!word) return 0;
  const length = word.length;
  // Simple heuristic for ORP: slightly left of center
  if (length === 1) return 0;
  if (length >= 2 && length <= 5) return 1;
  if (length >= 6 && length <= 9) return 2;
  if (length >= 10 && length <= 13) return 3;
  return 4; // Cap at 4th index (5th letter) for very long words
}

export function splitTextIntoWords(text: string): string[] {
    // This is a basic implementation, can be improved to handle punctuation delays which we might store as metadata later
    return text.trim().split(/\s+/).filter(w => w.length > 0);
}

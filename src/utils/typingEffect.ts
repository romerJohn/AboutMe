export interface TypingState {
  wordIndex: number;
  charIndex: number;
  isDeleting: boolean;
  displayText: string;
}

export const DEFAULT_ROLES = [
  'AI Engineer',
  'Full-stack Developer',
  'Tech Innovator'
];

/**
 * Computes the next state in a typing effect step machine.
 * This pure function makes the typing logic 100% testable without waiting on real timers.
 */
export function getNextTypingState(
  currentState: TypingState,
  words: string[] = DEFAULT_ROLES
): TypingState {
  if (!words || words.length === 0) {
    return { wordIndex: 0, charIndex: 0, isDeleting: false, displayText: '' };
  }

  const currentWord = words[currentState.wordIndex % words.length];

  if (!currentState.isDeleting) {
    // Typing forward
    if (currentState.charIndex < currentWord.length) {
      const nextCharIndex = currentState.charIndex + 1;
      return {
        ...currentState,
        charIndex: nextCharIndex,
        displayText: currentWord.slice(0, nextCharIndex),
        isDeleting: false
      };
    } else {
      // Reached end of current word, start deleting
      return {
        ...currentState,
        isDeleting: true
      };
    }
  } else {
    // Deleting backward
    if (currentState.charIndex > 0) {
      const nextCharIndex = currentState.charIndex - 1;
      return {
        ...currentState,
        charIndex: nextCharIndex,
        displayText: currentWord.slice(0, nextCharIndex),
        isDeleting: true
      };
    } else {
      // Completed deleting, advance to next word
      const nextWordIndex = (currentState.wordIndex + 1) % words.length;
      return {
        wordIndex: nextWordIndex,
        charIndex: 0,
        isDeleting: false,
        displayText: ''
      };
    }
  }
}

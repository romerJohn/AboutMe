import { useState, useEffect } from 'react';
import { getNextTypingState, DEFAULT_ROLES, TypingState } from '../utils/typingEffect';

interface UseTypingEffectOptions {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function useTypingEffect({
  words = DEFAULT_ROLES,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1800
}: UseTypingEffectOptions = {}) {
  const [state, setState] = useState<TypingState>({
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    displayText: ''
  });

  useEffect(() => {
    const currentWord = words[state.wordIndex % words.length];
    let delay = state.isDeleting ? deletingSpeed : typingSpeed;

    // Pause when the word is fully typed before starting deletion
    if (!state.isDeleting && state.charIndex === currentWord.length) {
      delay = pauseDuration;
    } else if (state.isDeleting && state.charIndex === 0) {
      delay = 400; // brief pause before typing next word
    }

    const timer = setTimeout(() => {
      setState((prev) => getNextTypingState(prev, words));
    }, delay);

    return () => clearTimeout(timer);
  }, [state, words, typingSpeed, deletingSpeed, pauseDuration]);

  return {
    displayText: state.displayText,
    currentWord: words[state.wordIndex % words.length],
    isDeleting: state.isDeleting,
    wordIndex: state.wordIndex
  };
}

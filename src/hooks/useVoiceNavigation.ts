import { useState, useEffect, useRef, useCallback } from 'react';
import { parseVoiceCommand, VoiceAction } from '../utils/voiceCommands';
import { ProjectCategory } from '../types/portfolio';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface UseVoiceNavigationProps {
  onNavigate?: (sectionId: string) => void;
  onFilterCategory?: (category: ProjectCategory) => void;
  onSearch?: (query: string) => void;
  onToggleTheme?: (targetTheme?: 'dark' | 'light') => void;
}

export function useVoiceNavigation({
  onNavigate,
  onFilterCategory,
  onSearch,
  onToggleTheme
}: UseVoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 4000);
  }, []);

  const handleAction = useCallback(
    (action: VoiceAction) => {
      switch (action.type) {
        case 'NAVIGATE': {
          showFeedback(`✓ ${action.label}`);
          onNavigate?.(action.sectionId);
          const targetEl = document.getElementById(action.sectionId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case 'FILTER_PROJECTS': {
          showFeedback(`✓ ${action.label}`);
          onFilterCategory?.(action.category);
          // Also scroll smoothly down to projects if not already there
          const projectsEl = document.getElementById('projects');
          if (projectsEl) {
            projectsEl.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case 'SEARCH_PROJECTS': {
          showFeedback(`✓ ${action.label}`);
          onSearch?.(action.query);
          const projectsEl = document.getElementById('projects');
          if (projectsEl) {
            projectsEl.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case 'TOGGLE_THEME': {
          showFeedback(`✓ ${action.label}`);
          onToggleTheme?.(action.targetTheme);
          break;
        }
        case 'DOWNLOAD_RESUME': {
          showFeedback(`✓ ${action.label}`);
          window.open('/resume.pdf', '_blank');
          break;
        }
        case 'UNKNOWN': {
          showFeedback(`? ${action.label}`);
          break;
        }
      }
    },
    [onNavigate, onFilterCategory, onSearch, onToggleTheme, showFeedback]
  );

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0]?.[0]?.transcript || '';
        setTranscript(text);
        const action = parseVoiceCommand(text);
        handleAction(action);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setError(`Voice input error: ${event.error}`);
          showFeedback(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors
        }
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [handleAction, showFeedback]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      showFeedback('Web Speech API is not supported in this browser.');
      return;
    }
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (err: any) {
        // Recognition may already be running
      }
    }
  }, [isSupported, isListening, showFeedback]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Global Keyboard Shortcut: Pressing 'v' when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'v' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening]);

  return {
    isListening,
    isSupported,
    transcript,
    feedback,
    error,
    startListening,
    stopListening,
    toggleListening,
    simulateVoiceCommand: (text: string) => {
      setTranscript(text);
      const action = parseVoiceCommand(text);
      handleAction(action);
    }
  };
}

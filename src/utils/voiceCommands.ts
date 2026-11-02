export type VoiceAction =
  | { type: 'NAVIGATE'; sectionId: 'hero' | 'about' | 'projects' | 'skills' | 'journey' | 'vlog' | 'certificates' | 'contact'; label: string }
  | { type: 'FILTER_PROJECTS'; category: 'all' | 'ai' | 'web' | 'systems' | 'saved'; label: string }
  | { type: 'SEARCH_PROJECTS'; query: string; label: string }
  | { type: 'TOGGLE_THEME'; targetTheme?: 'dark' | 'light'; label: string }
  | { type: 'DOWNLOAD_RESUME'; label: string }
  | { type: 'UNKNOWN'; transcript: string; label: string };

/**
 * Parses user voice transcript into deterministic navigation and filtering actions
 */
export function parseVoiceCommand(rawTranscript: string): VoiceAction {
  const text = (rawTranscript || '').trim().toLowerCase();
  if (!text) {
    return { type: 'UNKNOWN', transcript: '', label: 'No speech detected' };
  }

  // 1. Navigation Commands
  if (
    text.includes('contact') ||
    text.includes('message') ||
    text.includes('email') ||
    text.includes('get in touch') ||
    text.includes('reach out')
  ) {
    return { type: 'NAVIGATE', sectionId: 'contact', label: 'Navigating to Contact' };
  }

  if (
    text.includes('project') ||
    text.includes('portfolio') ||
    text.includes('work') ||
    text.includes('repositories') ||
    text.includes('showcase')
  ) {
    // Check if filtering is specified inside project command
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
      return { type: 'FILTER_PROJECTS', category: 'ai', label: 'Filtering AI Projects' };
    }
    if (text.includes('web') || text.includes('frontend') || text.includes('fullstack')) {
      return { type: 'FILTER_PROJECTS', category: 'web', label: 'Filtering Web Projects' };
    }
    if (text.includes('system') || text.includes('backend') || text.includes('architecture')) {
      return { type: 'FILTER_PROJECTS', category: 'systems', label: 'Filtering Systems Projects' };
    }
    if (text.includes('saved') || text.includes('bookmark') || text.includes('favorite')) {
      return { type: 'FILTER_PROJECTS', category: 'saved', label: 'Showing Saved Projects' };
    }
    if (text.includes('all') || text.includes('reset') || text.includes('clear')) {
      return { type: 'FILTER_PROJECTS', category: 'all', label: 'Showing All Projects' };
    }
    return { type: 'NAVIGATE', sectionId: 'projects', label: 'Navigating to Projects' };
  }

  // Direct category commands without the word "project"
  if (text.includes('filter ai') || text.includes('show ai') || text === 'ai') {
    return { type: 'FILTER_PROJECTS', category: 'ai', label: 'Filtering AI Projects' };
  }
  if (text.includes('filter web') || text.includes('show web')) {
    return { type: 'FILTER_PROJECTS', category: 'web', label: 'Filtering Web Projects' };
  }
  if (text.includes('filter systems') || text.includes('show systems') || text.includes('systems')) {
    return { type: 'FILTER_PROJECTS', category: 'systems', label: 'Filtering Systems Projects' };
  }
  if (text.includes('filter saved') || text.includes('show saved') || text.includes('bookmarks')) {
    return { type: 'FILTER_PROJECTS', category: 'saved', label: 'Showing Saved Projects' };
  }
  if (text.includes('show all') || text.includes('reset filter')) {
    return { type: 'FILTER_PROJECTS', category: 'all', label: 'Showing All Projects' };
  }

  // Theme Switching Commands
  if (text.includes('light mode') || text.includes('light theme') || text.includes('high contrast')) {
    return { type: 'TOGGLE_THEME', targetTheme: 'light', label: 'Switching to High-Contrast Light Mode' };
  }
  if (text.includes('dark mode') || text.includes('dark theme')) {
    return { type: 'TOGGLE_THEME', targetTheme: 'dark', label: 'Switching to Dark Cyber Mode' };
  }
  if (text.includes('toggle theme') || text.includes('change theme') || text.includes('switch theme')) {
    return { type: 'TOGGLE_THEME', label: 'Toggling Theme' };
  }

  // Resume Download Commands
  if (text.includes('resume') || text.includes('cv') || text.includes('curriculum vitae')) {
    return { type: 'DOWNLOAD_RESUME', label: 'Opening Resume PDF' };
  }

  // Navigation to About, Skills, Journey, Hero
  if (text.includes('about') || text.includes('bio') || text.includes('who are you')) {
    return { type: 'NAVIGATE', sectionId: 'about', label: 'Navigating to About' };
  }

  if (text.includes('skill') || text.includes('stack') || text.includes('technolog')) {
    return { type: 'NAVIGATE', sectionId: 'skills', label: 'Navigating to Skills' };
  }

  if (text.includes('life journey') || text.includes('visual diary') || text.includes('photo album') || text.includes('vlog') || text.includes('memories')) {
    return { type: 'NAVIGATE', sectionId: 'vlog', label: 'Navigating to Life Journey' };
  }

  if (text.includes('journey') || text.includes('timeline') || text.includes('experience') || text.includes('history')) {
    return { type: 'NAVIGATE', sectionId: 'journey', label: 'Navigating to Journey' };
  }

  if (text.includes('certificate') || text.includes('certification') || text.includes('credential') || text.includes('accreditation')) {
    return { type: 'NAVIGATE', sectionId: 'certificates', label: 'Navigating to Certificates' };
  }

  if (text.includes('home') || text.includes('top') || text.includes('hero') || text.includes('start')) {
    return { type: 'NAVIGATE', sectionId: 'hero', label: 'Navigating to Home' };
  }

  // Search Commands (e.g. "search react", "find typescript")
  const searchMatch = text.match(/(?:search|find|look for|filter by)\s+([a-z0-9.#+_-]+)/i);
  if (searchMatch && searchMatch[1]) {
    const query = searchMatch[1];
    return { type: 'SEARCH_PROJECTS', query, label: `Searching projects for "${query}"` };
  }

  return { type: 'UNKNOWN', transcript: rawTranscript, label: `Unrecognized command: "${rawTranscript}"` };
}

/**
 * Checks if a project is in the saved bookmarked list
 */
export function isProjectBookmarked(projectId: string, bookmarks: string[]): boolean {
  return bookmarks.includes(projectId);
}

/**
 * Toggles a project ID in a bookmark array immutably
 */
export function toggleProjectBookmark(projectId: string, bookmarks: string[]): string[] {
  if (bookmarks.includes(projectId)) {
    return bookmarks.filter((id) => id !== projectId);
  }
  return [...bookmarks, projectId];
}

/**
 * Generates an accessible direct shareable link for a project
 */
export function generateProjectLink(projectId: string, origin: string = ''): string {
  const base = origin.replace(/\/$/, '');
  return `${base}#project-${projectId}`;
}

const STORAGE_KEY = 'kai_portfolio_bookmarked_projects';

/**
 * Loads bookmarked project IDs from localStorage safely
 */
export function loadSavedBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists bookmarked project IDs to localStorage safely
 */
export function persistBookmarks(bookmarks: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // Ignore storage quota or disabled localStorage errors
  }
}

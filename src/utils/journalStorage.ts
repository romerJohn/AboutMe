import {
  JournalCategory,
  JournalMemory,
  JOURNAL_CATEGORIES,
  MemoryAspectRatio
} from '../types/journal';

export const JOURNAL_STORAGE_KEY = 'kai_ross_life_journal_memories';
export const OWNER_AUTH_KEY = 'kai_ross_owner_session_active';
export const OWNER_PASSCODES = ['kai2026', 'kai-ross-journey', 'admin2026'];

/**
 * Loads memories from localStorage.
 * Defaults to an empty list as required:
 * "Do not populate the gallery with fabricated personal memories. Use an appropriate empty state until I upload actual photographs."
 */
export function loadStoredMemories(): JournalMemory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredMemories(memories: JournalMemory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to storage:', err);
  }
}

/**
 * Filters memories based on ownership. Visitors only see published entries.
 */
export function getVisibleMemories(memories: JournalMemory[], isOwner: boolean): JournalMemory[] {
  if (isOwner) return memories;
  return memories.filter((m) => m.isPublished);
}

/**
 * Filters memories by selected category.
 */
export function filterMemoriesByCategory(
  memories: JournalMemory[],
  category: string
): JournalMemory[] {
  if (!category || category === 'All') return memories;
  return memories.filter((m) => m.category === category);
}

export type JournalSortOption = 'newest' | 'oldest' | 'photos';

/**
 * Sorts memories by option (newest, oldest, or most photos).
 */
export function sortMemories(
  memories: JournalMemory[],
  sortBy: JournalSortOption = 'newest'
): JournalMemory[] {
  return [...memories].sort((a, b) => {
    if (sortBy === 'photos') {
      return (b.images?.length || 0) - (a.images?.length || 0);
    }
    const timeA = new Date(a.date).getTime() || a.createdAt;
    const timeB = new Date(b.date).getTime() || b.createdAt;
    return sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
  });
}

export function sortMemoriesChronologically(
  memories: JournalMemory[],
  order: 'desc' | 'asc' = 'desc'
): JournalMemory[] {
  return sortMemories(memories, order === 'desc' ? 'newest' : 'oldest');
}


/**
 * Groups memories by calendar year for the timeline view.
 */
export function groupMemoriesByYear(
  memories: JournalMemory[]
): Record<string, JournalMemory[]> {
  const sorted = sortMemoriesChronologically(memories, 'desc');
  const groups: Record<string, JournalMemory[]> = {};

  for (const memory of sorted) {
    const year = memory.date ? memory.date.slice(0, 4) : '2026';
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(memory);
  }

  return groups;
}

/**
 * Validates memory form fields before submission.
 */
export function validateMemoryForm(data: Partial<JournalMemory>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required.';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!data.date || !data.date.trim()) {
    errors.date = 'Date of experience is required.';
  }

  if (!data.location || !data.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (!data.category || !JOURNAL_CATEGORIES.includes(data.category as JournalCategory)) {
    errors.category = 'Please select a valid experience category.';
  }

  if (!data.story || !data.story.trim()) {
    errors.story = 'Please share the story or description of this memory.';
  }

  if (!data.images || data.images.length === 0) {
    errors.images = 'Please upload at least one photograph for this memory album.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Verifies owner authentication passcode.
 */
export function verifyOwnerPasscode(code: string): boolean {
  if (!code) return false;
  const clean = code.trim().toLowerCase();
  return OWNER_PASSCODES.includes(clean);
}

export function checkOwnerSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(OWNER_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setOwnerSession(status: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (status) {
      sessionStorage.setItem(OWNER_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(OWNER_AUTH_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Resolves the CSS aspect ratio utility class for a memory card thumbnail.
 * If explicitly set, returns that ratio's class.
 * If 'auto' or undefined, provides a rhythmic editorial aspect ratio based on index.
 */
export function getMemoryAspectRatioClass(
  aspectRatio?: MemoryAspectRatio,
  index = 0
): string {
  if (aspectRatio && aspectRatio !== 'auto') {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4]';
      case 'tall':
        return 'aspect-[2/3]';
      case 'square':
        return 'aspect-square';
      case 'wide':
        return 'aspect-[16/9]';
      case 'landscape':
      default:
        return 'aspect-[16/10]';
    }
  }

  // Rhythmic editorial variation for masonry layout
  const rhythmicPattern: string[] = [
    'aspect-[16/10]', // 0: Landscape
    'aspect-[3/4]',   // 1: Portrait
    'aspect-square',  // 2: Square
    'aspect-[2/3]',   // 3: Tall
    'aspect-[16/9]',  // 4: Wide
    'aspect-[4/5]'    // 5: Soft Portrait
  ];

  return rhythmicPattern[index % rhythmicPattern.length];
}

/**
 * Detects the closest semantic aspect ratio from image width and height.
 */
export function detectImageOrientation(width: number, height: number): MemoryAspectRatio {
  if (!width || !height) return 'landscape';
  const ratio = width / height;
  if (ratio >= 1.7) return 'wide';
  if (ratio >= 1.2) return 'landscape';
  if (ratio >= 0.88) return 'square';
  if (ratio >= 0.7) return 'portrait';
  return 'tall';
}

export interface CompressedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: MemoryAspectRatio;
}

/**
 * Compresses an uploaded image file on the client using HTMLCanvasElement,
 * returning the optimized data URL, dimensions, and detected aspect ratio.
 */
export function compressImageFileWithMeta(
  file: File,
  maxDimension = 1400,
  quality = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const naturalOrientation = detectImageOrientation(width, height);

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: e.target?.result as string,
            width,
            height,
            aspectRatio: naturalOrientation
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
          aspectRatio: naturalOrientation
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an uploaded image file on the client using HTMLCanvasElement,
 * producing an optimized data URL to avoid exceeding storage limits.
 */
export async function compressImageFile(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  const result = await compressImageFileWithMeta(file, maxDimension, quality);
  return result.dataUrl;
}

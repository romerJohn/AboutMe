export type JournalCategory =
  | 'Adventures & Hiking'
  | 'Travel & Exploration'
  | 'Friends & Memories'
  | 'School Life'
  | 'Personal Achievements'
  | 'Everyday Moments';

export const JOURNAL_CATEGORIES: JournalCategory[] = [
  'Adventures & Hiking',
  'Travel & Exploration',
  'Friends & Memories',
  'School Life',
  'Personal Achievements',
  'Everyday Moments'
];

export type MemoryAspectRatio =
  | 'auto'
  | 'landscape'
  | 'portrait'
  | 'tall'
  | 'square'
  | 'wide';

export interface JournalImage {
  id: string;
  url: string;
  caption?: string;
  isCover: boolean;
  aspectRatio?: MemoryAspectRatio;
}

export interface JournalMemory {
  id: string;
  title: string;
  story: string;
  date: string; // YYYY-MM-DD
  location: string;
  category: JournalCategory;
  tags: string[];
  images: JournalImage[];
  isPublished: boolean;
  isFeatured: boolean;
  aspectRatio?: MemoryAspectRatio;
  createdAt: number;
  updatedAt: number;
}


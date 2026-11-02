import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Calendar,
  MapPin,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Search,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  Maximize2,
  Mountain,
  Plane,
  Users,
  GraduationCap,
  Trophy,
  Coffee,
  LayoutGrid,
  ArrowUpDown,
  Columns3,
  Grid3X3
} from 'lucide-react';
import {
  JournalMemory,
  JournalCategory,
  JOURNAL_CATEGORIES,
  JournalImage,
  MemoryAspectRatio
} from '../types/journal';
import {
  loadStoredMemories,
  saveStoredMemories,
  getVisibleMemories,
  filterMemoriesByCategory,
  sortMemoriesChronologically,
  sortMemories,
  JournalSortOption,
  groupMemoriesByYear,
  validateMemoryForm,
  verifyOwnerPasscode,
  checkOwnerSession,
  setOwnerSession,
  compressImageFile,
  compressImageFileWithMeta,
  getMemoryAspectRatioClass
} from '../utils/journalStorage';
import { ScrollReveal } from './ScrollReveal';
import { buttonInteractionVariants } from '../utils/motionVariants';


const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  All: LayoutGrid,
  'Adventures & Hiking': Mountain,
  'Travel & Exploration': Plane,
  'Friends & Memories': Users,
  'School Life': GraduationCap,
  'Personal Achievements': Trophy,
  'Everyday Moments': Coffee
};

export const Vlog: React.FC = () => {
  // Memories and authentication state
  const [memories, setMemories] = useState<JournalMemory[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'gallery' | 'timeline'>('gallery');
  const [galleryLayout, setGalleryLayout] = useState<'masonry' | 'grid'>('masonry');
  const [sortBy, setSortBy] = useState<JournalSortOption>('newest');

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<JournalMemory>>({
    title: '',
    story: '',
    date: new Date().toISOString().slice(0, 10),
    location: '',
    category: 'Adventures & Hiking',
    aspectRatio: 'auto',
    tags: [],
    images: [],
    isPublished: true,
    isFeatured: false
  });
  const [tagInput, setTagInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Detail view and Lightbox states
  const [detailMemory, setDetailMemory] = useState<JournalMemory | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load initial memories and owner session
  useEffect(() => {
    setMemories(loadStoredMemories());
    setIsOwner(checkOwnerSession());
  }, []);

  // Update storage on memory changes
  const updateMemories = (newMemories: JournalMemory[]) => {
    setMemories(newMemories);
    saveStoredMemories(newMemories);
  };

  // Filtered and sorted visible memories
  const visibleMemories = useMemo(() => {
    const list = getVisibleMemories(memories, isOwner);
    const byCategory = filterMemoriesByCategory(list, selectedCategory);
    let filtered = byCategory;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = byCategory.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.story.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return sortMemories(filtered, sortBy);
  }, [memories, isOwner, selectedCategory, searchQuery, sortBy]);

  // Featured memory
  const featuredMemory = useMemo(() => {
    const published = visibleMemories.filter((m) => m.isPublished);
    return published.find((m) => m.isFeatured) || published[0] || null;
  }, [visibleMemories]);

  // Grouped by year for timeline
  const memoriesByYear = useMemo(() => {
    return groupMemoriesByYear(visibleMemories);
  }, [visibleMemories]);

  // Owner authentication handling
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOwnerPasscode(passcode)) {
      setIsOwner(true);
      setOwnerSession(true);
      setAuthModalOpen(false);
      setPasscode('');
      setAuthError(null);
    } else {
      setAuthError('Incorrect passcode. Please check your owner key.');
    }
  };

  const handleLogout = () => {
    setIsOwner(false);
    setOwnerSession(false);
  };

  // Open editor for new or existing memory
  const handleOpenEditor = (memory?: JournalMemory) => {
    if (memory) {
      setEditingMemoryId(memory.id);
      setFormData({ ...memory });
      setTagInput(memory.tags.join(', '));
    } else {
      setEditingMemoryId(null);
      setFormData({
        title: '',
        story: '',
        date: new Date().toISOString().slice(0, 10),
        location: '',
        category: 'Adventures & Hiking',
        aspectRatio: 'auto',
        tags: [],
        images: [],
        isPublished: true,
        isFeatured: false
      });
      setTagInput('');
    }
    setFormErrors({});
    setEditorModalOpen(true);
  };

  // Handle image upload from disk
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: JournalImage[] = [];

    try {
      let detectedFirstRatio: MemoryAspectRatio | undefined = undefined;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await compressImageFileWithMeta(file);
        if (i === 0) detectedFirstRatio = result.aspectRatio;
        newImages.push({
          id: `img-${Date.now()}-${i}`,
          url: result.dataUrl,
          caption: '',
          isCover: (formData.images?.length === 0 && i === 0),
          aspectRatio: result.aspectRatio
        });
      }

      setFormData((prev) => {
        const existing = prev.images || [];
        const hasCover = existing.some((img) => img.isCover);
        if (!hasCover && newImages.length > 0) {
          newImages[0].isCover = true;
        }
        return {
          ...prev,
          aspectRatio:
            !prev.aspectRatio || prev.aspectRatio === 'auto'
              ? (detectedFirstRatio || 'auto')
              : prev.aspectRatio,
          images: [...existing, ...newImages]
        };
      });
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSetCoverImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).map((img) => ({
        ...img,
        isCover: img.id === imageId
      }))
    }));
  };

  const handleDeleteImage = (imageId: string) => {
    setFormData((prev) => {
      const remaining = (prev.images || []).filter((img) => img.id !== imageId);
      if (remaining.length > 0 && !remaining.some((img) => img.isCover)) {
        remaining[0].isCover = true;
      }
      return { ...prev, images: remaining };
    });
  };

  const handleSaveMemory = (publishState: boolean) => {
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const memoryToValidate: Partial<JournalMemory> = {
      ...formData,
      tags,
      isPublished: publishState
    };

    const validation = validateMemoryForm(memoryToValidate);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const now = Date.now();
    if (editingMemoryId) {
      const updated = memories.map((m) =>
        m.id === editingMemoryId
          ? ({
              ...m,
              ...(memoryToValidate as JournalMemory),
              updatedAt: now
            } as JournalMemory)
          : m
      );
      updateMemories(updated);
    } else {
      const newMemory: JournalMemory = {
        id: `mem-${now}`,
        title: formData.title!.trim(),
        story: formData.story!.trim(),
        date: formData.date!,
        location: formData.location!.trim(),
        category: formData.category as JournalCategory,
        aspectRatio: formData.aspectRatio || 'auto',
        tags,
        images: formData.images || [],
        isPublished: publishState,
        isFeatured: Boolean(formData.isFeatured),
        createdAt: now,
        updatedAt: now
      };
      updateMemories([newMemory, ...memories]);
    }

    setEditorModalOpen(false);
  };

  const handleDeleteMemory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      const updated = memories.filter((m) => m.id !== id);
      updateMemories(updated);
      if (detailMemory?.id === id) {
        setDetailMemory(null);
      }
    }
  };

  // Lightbox keyboard navigation
  const activeAlbumImages = detailMemory?.images || [];
  const handlePrevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : activeAlbumImages.length - 1));
  }, [activeAlbumImages.length]);

  const handleNextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev < activeAlbumImages.length - 1 ? prev + 1 : 0));
  }, [activeAlbumImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrevImage, handleNextImage]);

  return (
    <section id="vlog" className="py-24 relative overflow-hidden" aria-label="Personal Life Journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Concept Tagline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <ScrollReveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
              <Compass className="w-4 h-4 text-[#00E5FF]" />
              <span>Personal Life Journey · Visual Diary</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
              My Life Journey
            </h2>
            <div className="text-cyan-300 font-mono text-sm tracking-wide mb-2 italic">
              "My Life, My Adventures, My Story."
            </div>
            <p className="text-base sm:text-lg text-slate-300">
              Beyond the code, here's the story of my adventures, experiences, discoveries, and unforgettable memories.
            </p>
          </ScrollReveal>

          {/* Owner Access Controls & View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#0D111B] p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'gallery'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#00E5FF] border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#00E5FF] border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
            </div>

            {/* Owner Authentication Toggle */}
            {isOwner ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditor()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                  <span>New Memory</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 border border-white/10 text-xs font-mono transition-colors cursor-pointer"
                  title="Lock Owner Access"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Owner (Unlocked)</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/30 text-xs font-mono transition-colors cursor-pointer"
                aria-label="Owner Access"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Owner Access</span>
              </button>
            )}
          </div>
        </div>

        {/* Featured Memory Spotlight (if available) */}
        {featuredMemory && viewMode === 'gallery' && (
          <ScrollReveal delay={0.05} className="mb-12">
            <div
              onClick={() => setDetailMemory(featuredMemory)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDetailMemory(featuredMemory);
                }
              }}
              className="group relative rounded-2xl bg-[#0D111B]/90 border border-white/10 hover:border-cyan-500/40 overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Featured Photo Banner */}
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-black/60">
                  {featuredMemory.images[0] ? (
                    <img
                      src={
                        featuredMemory.images.find((i) => i.isCover)?.url ||
                        featuredMemory.images[0].url
                      }
                      alt={featuredMemory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#090D16]">
                      <Camera className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D111B] via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-[#00E5FF] text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Experience</span>
                  </div>
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{featuredMemory.images.length} Photographs</span>
                  </div>
                </div>

                {/* Narrative Preview Column */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="text-[#00E5FF] font-semibold">{featuredMemory.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {featuredMemory.date}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      {featuredMemory.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{featuredMemory.location}</span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                      {featuredMemory.story}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {featuredMemory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#00E5FF] group-hover:underline inline-flex items-center gap-1 font-semibold">
                      <span>View Story & Photo Album</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    {!featuredMemory.isPublished && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Enhanced Interactive Category Filter & Sorting Bar */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-[#0D111B]/85 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="font-semibold text-white">Categories:</span>
              </span>

              {/* 'All' Filter Button */}
              {(() => {
                const Icon = CATEGORY_ICONS['All'];
                const isActive = selectedCategory === 'All';
                const count = getVisibleMemories(memories, isOwner).length;
                return (
                  <motion.button
                    key="All"
                    type="button"
                    variants={buttonInteractionVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedCategory('All')}
                    className={`group relative px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-cyan-500/25 text-[#00E5FF] border border-cyan-400/60 font-semibold shadow-[0_0_20px_-3px_rgba(0,229,255,0.4)] ring-1 ring-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                    <span>All</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-sans tabular-nums ${
                        isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })()}

              {/* Defined Vlog Categories */}
              {JOURNAL_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] || Sparkles;
                const isActive = selectedCategory === cat;
                const count = getVisibleMemories(memories, isOwner).filter((m) => m.category === cat).length;
                return (
                  <motion.button
                    key={cat}
                    type="button"
                    variants={buttonInteractionVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedCategory(cat)}
                    className={`group relative px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-cyan-500/25 text-[#00E5FF] border border-cyan-400/60 font-semibold shadow-[0_0_20px_-3px_rgba(0,229,255,0.4)] ring-1 ring-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-sans tabular-nums ${
                        isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}

            </div>

            {/* Right Controls: Sort Order & Search Box */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Sort Dropdown */}
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as JournalSortOption)}
                  className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                  aria-label="Sort memories by"
                >
                  <option value="newest" className="bg-[#0D111B] text-white">Newest First</option>
                  <option value="oldest" className="bg-[#0D111B] text-white">Oldest First</option>
                  <option value="photos" className="bg-[#0D111B] text-white">Most Photos</option>
                </select>
              </div>

              {/* Gallery Layout Switcher: Masonry vs Uniform */}
              {viewMode === 'gallery' && (
                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setGalleryLayout('masonry')}
                    className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      galleryLayout === 'masonry'
                        ? 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40 font-semibold shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Masonry Waterfall Layout (Adaptive Aspect Ratios)"
                    aria-label="Masonry layout"
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Masonry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryLayout('grid')}
                    className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      galleryLayout === 'grid'
                        ? 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40 font-semibold shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Uniform Grid Layout"
                    aria-label="Uniform grid layout"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Grid</span>
                  </button>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/60 font-mono transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Summary Feedback Bar */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">Filtering:</span>
                <span className="text-white font-semibold">"{selectedCategory}"</span>
                {searchQuery && (
                  <span>with search query <span className="text-cyan-200 font-semibold">"{searchQuery}"</span></span>
                )}
                <span className="text-slate-600">·</span>
                <span className="text-[#00E5FF] tabular-nums font-semibold">{visibleMemories.length} memories matching</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs text-[#00E5FF] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* View Content: Gallery View or Timeline View */}
        {visibleMemories.length > 0 ? (
          viewMode === 'gallery' ? (
            /* Editorial Responsive Masonry or Uniform Grid Gallery */
            <div
              className={
                galleryLayout === 'masonry'
                  ? 'columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              }
            >
              {visibleMemories.map((memory, idx) => {
                const coverImage =
                  memory.images.find((i) => i.isCover) || memory.images[0];
                const ratioClass =
                  galleryLayout === 'masonry'
                    ? getMemoryAspectRatioClass(memory.aspectRatio, idx)
                    : 'aspect-[16/10]';

                return (
                  <ScrollReveal
                    key={memory.id}
                    delay={idx * 0.05}
                    className={
                      galleryLayout === 'masonry'
                        ? 'break-inside-avoid mb-6 sm:mb-8 inline-block w-full'
                        : 'h-full flex flex-col'
                    }
                  >
                    <div
                      onClick={() => setDetailMemory(memory)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setDetailMemory(memory);
                        }
                      }}
                      className="group relative rounded-2xl bg-[#0D111B]/90 border border-white/[0.08] hover:border-cyan-500/40 flex flex-col justify-between overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] w-full"
                    >
                      {/* Photo Thumbnail with Dynamic / Configured Aspect Ratio */}
                      <div className={`relative ${ratioClass} w-full overflow-hidden bg-black/60 border-b border-white/[0.06]`}>
                        {coverImage ? (
                          <img
                            src={coverImage.url}
                            alt={memory.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#08090D]">
                            <Camera className="w-10 h-10 text-slate-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                        {/* Badges on Image */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 font-mono text-[11px] text-[#00E5FF]">
                            {memory.category}
                          </span>
                          <div className="flex items-center gap-1">
                            {!memory.isPublished && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/80 backdrop-blur-md text-slate-950 font-mono text-[10px] font-semibold">
                                Draft
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 font-mono text-[10px] text-slate-300 flex items-center gap-1">
                              <Camera className="w-3 h-3 text-cyan-400" />
                              <span>{memory.images.length}</span>
                            </span>
                          </div>
                        </div>

                        {/* Location and Date Pill */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                          <div className="flex items-center gap-1 truncate max-w-[180px] bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                            <span className="truncate">{memory.location}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                            <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{memory.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00E5FF] transition-colors">
                            {memory.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
                            {memory.story}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {memory.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/[0.04] text-cyan-200 border border-white/[0.06]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer & Owner Actions */}
                        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          <span className="text-[#00E5FF] group-hover:underline inline-flex items-center gap-1">
                            <span>Explore Album</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>

                          {isOwner && (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditor(memory)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                                title="Edit Memory"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteMemory(memory.id, e)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete Memory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            /* Chronological Journey Timeline View */
            <div className="space-y-12 max-w-4xl mx-auto">
              {Object.keys(memoriesByYear).map((year) => (
                <div key={year} className="relative">
                  {/* Year Marker */}
                  <div className="sticky top-20 z-20 mb-6 flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[#00E5FF] font-mono text-sm font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] backdrop-blur-md">
                      {year}
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
                  </div>

                  {/* Vertical Timeline Items */}
                  <div className="border-l-2 border-cyan-500/20 ml-6 pl-8 space-y-8 relative">
                    {memoriesByYear[year].map((memory) => (
                      <div
                        key={memory.id}
                        onClick={() => setDetailMemory(memory)}
                        className="group relative rounded-2xl bg-[#0D111B]/90 border border-white/10 hover:border-cyan-500/40 p-5 sm:p-6 shadow-xl cursor-pointer transition-all hover:-translate-x-1"
                      >
                        {/* Glowing Timeline Node Dot */}
                        <div className="absolute -left-[41px] top-6 w-4 h-4 rounded-full bg-[#08090D] border-2 border-[#00E5FF] shadow-[0_0_10px_#00E5FF] group-hover:scale-125 transition-transform" />

                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                              <span className="text-[#00E5FF] font-semibold">{memory.category}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                {memory.date}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                {memory.location}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {memory.title}
                            </h4>
                            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                              {memory.story}
                            </p>
                          </div>

                          {/* Thumbnail Preview */}
                          {memory.images[0] && (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10">
                              <img
                                src={
                                  memory.images.find((i) => i.isCover)?.url ||
                                  memory.images[0].url
                                }
                                alt={memory.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                                {memory.images.length}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty State: Clear, purposeful, unpopulated */
          <div className="py-20 text-center rounded-2xl bg-[#0D111B]/60 border border-white/[0.08] p-8 max-w-2xl mx-auto backdrop-blur-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF]">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Visual Journal Awaiting First Entry
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Kai's personal travel logs, hiking adventures, and life milestones will be documented here.
              Check back soon for new photography dispatches.
            </p>
            {isOwner ? (
              <button
                type="button"
                onClick={() => handleOpenEditor()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Upload First Memory & Photographs</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Owner Login to Publish Stories</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Experience Detail View Modal & Photo Gallery */}
      {detailMemory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setDetailMemory(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0D111B] rounded-2xl border border-cyan-500/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
                  <span>{detailMemory.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    {detailMemory.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {detailMemory.location}
                  </span>
                </div>
                <h3 id="detail-modal-title" className="text-2xl sm:text-3xl font-bold text-white">
                  {detailMemory.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailMemory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                aria-label="Close detail view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Narrative Story */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
              {detailMemory.story}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
              {detailMemory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded text-xs font-mono bg-white/[0.04] text-cyan-200 border border-white/[0.08]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Photo Album Gallery Grid */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-300">
                  <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                  <span>Photo Album ({detailMemory.images.length} Photographs)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Click any photo to open Lightbox
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {detailMemory.images.map((img, iIdx) => (
                  <div
                    key={img.id}
                    onClick={() => {
                      setLightboxIndex(iIdx);
                      setLightboxOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 hover:border-cyan-500/60 cursor-pointer shadow-md"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `${detailMemory.title} photo ${iIdx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1 text-[10px] font-mono text-white truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox with Next/Previous Navigation */}
      {lightboxOpen && activeAlbumImages.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl select-none"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Lightbox Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close Lightbox (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Photo Counter */}
          <div className="absolute top-5 left-5 z-50 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-xs font-mono text-cyan-300">
            {lightboxIndex + 1} / {activeAlbumImages.length}
          </div>

          {/* Previous Button */}
          {activeAlbumImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-cyan-500 hover:text-black transition-all cursor-pointer"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {activeAlbumImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-cyan-500 hover:text-black transition-all cursor-pointer"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Active Lightbox Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
          >
            <img
              src={activeAlbumImages[lightboxIndex]?.url}
              alt={activeAlbumImages[lightboxIndex]?.caption || 'Full view memory'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {activeAlbumImages[lightboxIndex]?.caption && (
              <p className="mt-3 text-center text-xs font-mono text-slate-300 bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
                {activeAlbumImages[lightboxIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Owner Passcode Authentication Modal */}
      {authModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setAuthModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0D111B] rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00E5FF]" />
                <h3 id="auth-modal-title" className="text-lg font-bold text-white">
                  Owner Journal Access
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Enter your portfolio owner passcode to upload photographs, edit stories, manage drafts, and curate your visual journal.
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter passcode (e.g. kai2026)"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  autoFocus
                />
                {authError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{authError}</span>
                  </div>
                )}
                <div className="text-[11px] font-mono text-slate-500 mt-2">
                  Default passcode: <code className="text-cyan-300">kai2026</code>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                >
                  Unlock Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Memory Editor & Photo Upload Modal */}
      {editorModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setEditorModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#0D111B] rounded-2xl border border-cyan-500/40 p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00E5FF]" />
                <h3 id="editor-modal-title" className="text-lg sm:text-xl font-bold text-white">
                  {editingMemoryId ? 'Edit Memory Entry' : 'Create New Memory & Photo Album'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Title of Experience *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sunrise Climb at Mount Rainier"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-400 font-mono mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Grid: Category, Date, Location, Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as JournalCategory })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {JOURNAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0D111B] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {formErrors.date && (
                    <p className="text-xs text-rose-400 font-mono mt-1">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Cascade Range, WA"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {formErrors.location && (
                    <p className="text-xs text-rose-400 font-mono mt-1">{formErrors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Card Ratio</label>
                  <select
                    value={formData.aspectRatio || 'auto'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aspectRatio: e.target.value as MemoryAspectRatio
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    aria-label="Masonry presentation aspect ratio"
                  >
                    <option value="auto" className="bg-[#0D111B] text-white">Auto (Adaptive)</option>
                    <option value="portrait" className="bg-[#0D111B] text-white">Portrait (3:4)</option>
                    <option value="tall" className="bg-[#0D111B] text-white">Editorial Tall (2:3)</option>
                    <option value="square" className="bg-[#0D111B] text-white">Square (1:1)</option>
                    <option value="landscape" className="bg-[#0D111B] text-white">Landscape (16:10)</option>
                    <option value="wide" className="bg-[#0D111B] text-white">Wide (16:9)</option>
                  </select>
                </div>
              </div>

              {/* Story / Description Textarea */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Story & Experience Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.story || ''}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Write about what happened, people you were with, thoughts, and discoveries..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                {formErrors.story && (
                  <p className="text-xs text-rose-400 font-mono mt-1">{formErrors.story}</p>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. Hiking, Summer2026, Friends, Trail"
                  className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Multi-Photo Upload Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-slate-300">
                    Photographs ({formData.images?.length || 0} uploaded) *
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-[#00E5FF] hover:bg-cyan-500/30 text-xs font-mono cursor-pointer transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Compressing...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {formErrors.images && (
                  <p className="text-xs text-rose-400 font-mono">{formErrors.images}</p>
                )}

                {/* Uploaded Images Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/[0.06]">
                  {(formData.images || []).map((img) => (
                    <div
                      key={img.id}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${
                        img.isCover ? 'border-[#00E5FF] ring-2 ring-cyan-500/40' : 'border-white/10'
                      }`}
                    >
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1">
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(img.id)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                            img.isCover
                              ? 'bg-[#00E5FF] text-slate-950 font-bold'
                              : 'bg-black/75 text-slate-300 hover:text-white'
                          }`}
                        >
                          {img.isCover ? 'Cover' : 'Set Cover'}
                        </button>
                      </div>
                      <div className="absolute top-1 right-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1 rounded bg-black/75 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(formData.images || []).length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs font-mono text-slate-500">
                      No photographs uploaded yet. Click "Upload Photos" above to select images from your device.
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={Boolean(formData.isFeatured)}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-white/20 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-mono text-slate-300">
                  Feature this memory in the top spotlight banner
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditorModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveMemory(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveMemory(true)}
                  className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                >
                  Publish Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export interface VlogVideo {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  duration: string;
  category: 'All' | 'AI Systems' | 'Full-Stack' | 'Architecture' | 'Lab Demos';
  tags: string[];
  youtubeId: string; // YouTube video ID or placeholder
  isSampleContent: boolean;
  views: string;
  keyTakeaways: string[];
}

export const vlogCategories = [
  'All',
  'AI Systems',
  'Full-Stack',
  'Architecture',
  'Lab Demos'
] as const;

export const vlogVideos: VlogVideo[] = [
  {
    id: 'intravision-ai-deepdive',
    title: 'Architecting IntraVision AI: Context Rules & Deterministic Scoring',
    description:
      'A technical breakdown of how we grounded foundation models to adhere to rigid sports tournament rules without hallucinating match outcomes.',
    publishDate: 'Oct 2026',
    duration: '14:28',
    category: 'AI Systems',
    tags: ['Gemini API', 'Next.js', 'Rule Grounding', 'TypeScript'],
    youtubeId: 'M7lc1UVf-VE', // Demo tech video ID
    isSampleContent: true,
    views: '2.4k',
    keyTakeaways: [
      'Separating deterministic validation from generative context evaluation',
      'Minimizing latency via structured JSON extraction mode',
      'Edge deployment with fallback error resilience'
    ]
  },
  {
    id: 'fullstack-realtime-sync',
    title: 'Real-Time State Synchronization & WebSockets in Production',
    description:
      'Designing low-latency full-duplex sync between client-side canvases, state-machines, and persistent backend microservices.',
    publishDate: 'Sep 2026',
    duration: '18:45',
    category: 'Full-Stack',
    tags: ['WebSockets', 'React', 'Node.js', 'State Machines'],
    youtubeId: 'dQw4w9WgXcQ', // Demo video ID
    isSampleContent: true,
    views: '3.8k',
    keyTakeaways: [
      'Optimistic client reconciliation during network jitter',
      'Binary array serialization for fast payload transmission',
      'Deadlock prevention in collaborative multi-client sessions'
    ]
  },
  {
    id: 'postgres-indexing-performance',
    title: 'PostgreSQL Indexing & High-Throughput Schema Strategies',
    description:
      'Deep dive into query execution plans, composite B-Tree indexes, partial indexing, and connection pool sizing for scalable APIs.',
    publishDate: 'Aug 2026',
    duration: '22:10',
    category: 'Architecture',
    tags: ['PostgreSQL', 'Database Design', 'EXPLAIN ANALYZE', 'Prisma'],
    youtubeId: 'jNQXAC9IVRw', // Demo video ID
    isSampleContent: true,
    views: '5.1k',
    keyTakeaways: [
      'Reading and optimizing EXPLAIN ANALYZE query trees',
      'Partitioning high-velocity timeseries event logs',
      'Preventing connection pool exhaustion under sudden traffic spikes'
    ]
  },
  {
    id: 'canvas-particle-physics-optimization',
    title: 'Interactive 60FPS Canvas Physics & Spatial Partitioning',
    description:
      'How to build silky-smooth 2D/3D visual particles and neural web graphs in vanilla Canvas API with zero dropped frames.',
    publishDate: 'Jul 2026',
    duration: '12:15',
    category: 'Lab Demos',
    tags: ['HTML5 Canvas', 'Mathematics', 'Spatial Hashing', 'Performance'],
    youtubeId: 'L_LUpnjgPso', // Demo video ID
    isSampleContent: true,
    views: '1.9k',
    keyTakeaways: [
      'Spatial grid hashing to reduce collision detection from O(N²) to O(N)',
      'Direct pixel buffer manipulation via ImageData',
      'Adaptive particle count scaling for lower-end mobile devices'
    ]
  }
];

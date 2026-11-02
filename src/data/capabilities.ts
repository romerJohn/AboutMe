import { CapabilityItem } from '../types/portfolio';

export const capabilities: CapabilityItem[] = [
  {
    id: 'ai-apps',
    title: 'AI-Powered Applications',
    summary:
      'Designing intelligent software that leverages foundation models for contextual analysis, guideline-based dispute resolution, automated classification, and conversational utility.',
    deliverables: [
      'Schema-grounded LLM completions & structured JSON extraction',
      'Context-aware assistants anchored to specific rulebooks and documents',
      'Defensive AI guardrails separating deterministic math from generative advice',
      'Multi-modal input processing and conversational stream handling'
    ],
    icon: 'Bot',
    accent: '#00E5FF'
  },
  {
    id: 'fullstack-web',
    title: 'Full-Stack Web Development',
    summary:
      'Building responsive, fast, and accessible digital products from interactive client-side interfaces down to backend API endpoints and secure authentication.',
    deliverables: [
      'Modern Single Page Applications (SPA) built with React 19, TypeScript, and Vite',
      'Responsive, accessible, and themeable UI architectures with Tailwind CSS',
      'Micro-interactions and fluid layout transitions with Motion',
      'Optimistic mutations, client-side caching, and resilient error recovery'
    ],
    icon: 'Layers',
    accent: '#8B5CF6'
  },
  {
    id: 'backend-systems',
    title: 'Backend, Database & System Integration',
    summary:
      'Engineering reliable service layers, normalized relational schemas, secure API controllers, and scalable deployment pipelines.',
    deliverables: [
      'RESTful endpoints with Node.js/Express and asynchronous Python/FastAPI',
      'PostgreSQL schema design, indexing, foreign key constraints, and migrations',
      'Real-time data synchronization with Supabase and WebSocket architectures',
      'CI/CD deployment automation on modern cloud platforms (Vercel, Render)'
    ],
    icon: 'Database',
    accent: '#38BDF8'
  }
];

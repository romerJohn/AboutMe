import { JourneyMilestone } from '../types/portfolio';

export const journeyMilestones: JourneyMilestone[] = [
  {
    period: 'Phase 01',
    title: 'Foundations of Modern Web Engineering',
    summary:
      'Mastered the core pillars of the web platform: semantic HTML, modern CSS architecture, and modern JavaScript (ES6+). Focused on DOM manipulation, responsive layouts, asynchronous promises, and clean code hygiene.',
    learnings: [
      'Semantic structure and accessibility standards (WCAG guidelines)',
      'Responsive design patterns across diverse viewport constraints',
      'JavaScript event loops, closures, and asynchronous execution flows'
    ],
    technologies: ['HTML5', 'CSS3', 'Modern JavaScript', 'Git']
  },
  {
    period: 'Phase 02',
    title: 'Interactive Frontend Architecture with React',
    summary:
      'Transitioned to declarative UI programming. Embraced component-driven architecture, reactive state management, custom hooks, and strict TypeScript modeling to eliminate runtime errors.',
    learnings: [
      'Declarative state synchronization and lifecycle management',
      'Strict TypeScript contracts and reusable UI component primitives',
      'Optimizing rendering cycles and handling asynchronous loading states'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
  },
  {
    period: 'Phase 03',
    title: 'Full-Stack Connectivity & Persistent Databases',
    summary:
      'Bridged client-side applications with server backends. Designed RESTful API endpoints, modeled relational schemas in PostgreSQL, implemented secure authentication flows, and handled data validation across network boundaries.',
    learnings: [
      'API routing, middleware chains, and token-based authentication',
      'Relational database normalization, foreign key constraints, and indexing',
      'Defensive input validation and secure credential management'
    ],
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Supabase']
  },
  {
    period: 'Phase 04',
    title: 'Applied AI Integrations & Model Pipelines',
    summary:
      'Explored integrating large language models and intelligent APIs into practical user workflows. Moved beyond simple prompts by building structured JSON-output pipelines, rule-grounded retrieval systems, and contextual assistants.',
    learnings: [
      'Prompt structuring and schema-constrained model outputs',
      'Grounding AI systems with domain rules to avoid hallucinations',
      'Handling latency, streaming responses, and graceful fallback UX'
    ],
    technologies: ['Google Gemini API', 'Python', 'FastAPI', 'Prompt Engineering']
  },
  {
    period: 'Phase 05',
    title: 'Architecting End-to-End Practical Software Systems',
    summary:
      'Currently designing and building cohesive, production-grade applications like IntraVision AI and TradePilot AI. Focusing on real-world system architecture, high-frequency state updates, and intuitive user experiences.',
    learnings: [
      'Coordinating full-stack lifecycles from database migrations to UI rendering',
      'Domain-driven design, deterministic risk calculations, and state machines',
      'Designing with strict attention to typography, polish, and UX clarity'
    ],
    technologies: ['Full-Stack Systems', 'PostgreSQL', 'FastAPI', 'Express', 'React']
  }
];

import { SkillCategory } from '../types/portfolio';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Engineering',
    description: 'Constructing performant, accessible, and reactive user interfaces with modern client frameworks.',
    skills: [
      { name: 'React', context: 'Component composition, custom hooks, reactive state & modern React 19 patterns' },
      { name: 'TypeScript', context: 'Strict type modeling, generics, discriminated unions, and safe API interfaces' },
      { name: 'JavaScript', context: 'ESNext features, asynchronous programming, event loop mechanics & DOM optimization' },
      { name: 'Tailwind CSS', context: 'Utility-first styling, design system tokens, responsive grids & dynamic dark palettes' },
      { name: 'HTML & CSS', context: 'Semantic HTML5 structure, accessibility best practices, Flexbox/Grid layouts & modern CSS' }
    ]
  },
  {
    title: 'Backend & Services',
    description: 'Architecting robust server environments, REST APIs, and structured data pipelines.',
    skills: [
      { name: 'Node.js', context: 'Asynchronous event-driven runtimes, file streaming, and CLI tooling' },
      { name: 'Express', context: 'Modular REST routing, middleware pipelines, error handling & token authentication' },
      { name: 'Python', context: 'Algorithmic data manipulation, script automation, and AI integration services' },
      { name: 'FastAPI', context: 'High-speed asynchronous Python endpoints with Pydantic validation & OpenAPI specs' }
    ]
  },
  {
    title: 'Database & Infrastructure',
    description: 'Managing relational schemas, cloud deployments, and version-controlled environments.',
    skills: [
      { name: 'PostgreSQL', context: 'Relational data modeling, foreign key integrity, indexing, and complex queries' },
      { name: 'Supabase', context: 'Postgres management, real-time table subscriptions, and Row Level Security policies' },
      { name: 'Git & GitHub', context: 'Branching workflows, version tracking, pull request reviews, and GitHub Actions' },
      { name: 'Vercel', context: 'Automated CI/CD deployments, edge caching, and serverless preview staging' },
      { name: 'Render', context: 'Cloud container hosting, web service orchestration, and managed background tasks' }
    ]
  },
  {
    title: 'AI & Development Tooling',
    description: 'Harnessing modern foundation models, assistive pipelines, and developer environments.',
    skills: [
      { name: 'Google Gemini API', context: 'Structured prompt engineering, multimodal analysis, and JSON schema response parsing' },
      { name: 'AI Workflows', context: 'Context-augmented code authoring, automated testing design, and systematic debugging' },
      { name: 'VS Code', context: 'Advanced development setup, terminal integration, and productivity toolchains' },
      { name: 'Developer Tooling', context: 'Vite bundler, npm package management, tsx runtime, ESLint, and PostCSS' }
    ]
  }
];

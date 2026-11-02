import { Project } from '../types/portfolio';

export const projects: Project[] = [
  {
    id: 'intravision-ai',
    title: 'IntraVision AI',
    subtitle: 'Intelligent Intramural Event Administration & Rule Assistance',
    description:
      'An intelligent intramurals management and scoring system designed to support event administration, participant registration, attendance tracking, dynamic scheduling, live standings, and AI-assisted guideline resolution.',
    longDescription:
      'IntraVision AI streamlines the operational complexity of organizing campus and organizational intramural sports. Organizers often struggle with manual bracket updates, disputable rule interpretations, player eligibility discrepancies, and fragmented schedules. This system establishes a centralized administration hub featuring automated round-robin and elimination tournament generation, real-time match outcome recording, tied-breaker calculators, and a Google Gemini-backed assistant grounded in official competition rulebooks for rapid dispute resolution.',
    category: 'ai',
    categories: ['ai', 'web'],
    technologies: ['React', 'TypeScript', 'Vite', 'Express', 'Supabase', 'Google Gemini'],
    coreTechnologies: ['React', 'AI', 'Node.js', 'Supabase'],
    status: 'In Development',
    featured: true,
    keyFeatures: [
      'Automated tournament bracket & round-robin schedule generator',
      'Participant registration and team roster eligibility validation',
      'Real-time match scoring and tie-breaker standings engine',
      'AI rule assistant grounded in tournament guidelines to clarify disputes',
      'Attendance and check-in confirmation workflows for tournament officials',
      'Mobile-optimized scorekeeper interface with instant table synchronization'
    ],
    architectureOverview:
      'Frontend built with React 19 and Tailwind for rapid interaction during live games. Backend services deployed with Express for tournament scheduling math, paired with Supabase PostgreSQL for real-time table subscriptions and row-level security. Intelligent rule consultations route via server proxy to Google Gemini with tournament rulebooks loaded in context.',
    challengesAndLearnings:
      'Designing tournament scheduling algorithms that gracefully handle odd-numbered teams, multi-court capacity constraints, and referee availability. Learned how to enforce strict JSON schemas when prompting Gemini for rule compliance judgments.',
    githubUrl: 'https://github.com/developer/intravision-ai',
    demoUrl: 'https://demo-intravision-ai.example.com',
    accentColor: '#00E5FF',
    previewType: 'intravision'
  },
  {
    id: 'tradepilot-ai',
    title: 'TradePilot AI',
    subtitle: 'Disciplined Crypto Portfolio & Technical Risk Analyzer',
    description:
      'An AI-assisted cryptocurrency trading and portfolio analysis application focused on risk awareness, structured multi-timeframe analysis, secure credential handling, and disciplined decision support.',
    longDescription:
      'TradePilot AI addresses emotional biases and unstructured risk management in retail digital asset trading. Rather than making black-box automated trades, TradePilot serves as an analytical co-pilot. It synthesizes technical indicators across multiple timeframes, calculates position sizing calibrated to maximum portfolio drawdown thresholds, and checks strategy setups against predefined discipline rules before execution.',
    category: 'systems',
    categories: ['ai', 'systems'],
    technologies: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'SQLAlchemy'],
    coreTechnologies: ['Python', 'AI', 'FastAPI', 'React'],
    status: 'In Development',
    featured: true,
    keyFeatures: [
      'Multi-timeframe technical indicator correlation & signal breakdown',
      'Dynamic risk-per-trade & capital preservation calculator',
      'Automated journal entries with trade rationale classification',
      'AI-assisted post-mortem reviews detecting emotional deviation patterns',
      'Secure environment configuration with client-side credential encryption',
      'Custom watchlist with alerts triggered by structured condition trees'
    ],
    architectureOverview:
      'Client-side SPA built with React and TypeScript, presenting high-density charting and risk metrics. High-performance asynchronous backend written in FastAPI (Python) with SQLAlchemy ORM and PostgreSQL for historical telemetry, strategy logs, and time-series aggregation.',
    challengesAndLearnings:
      'Managing asynchronous data pipelines from multiple market feeds without UI stutter. Emphasized guardrails to prevent AI hallucinations in numerical risk evaluations by performing all mathematical operations in deterministic Python routines.',
    githubUrl: 'https://github.com/developer/tradepilot-ai',
    demoUrl: 'https://demo-tradepilot-ai.example.com',
    accentColor: '#8B5CF6',
    previewType: 'tradepilot'
  },
  {
    id: 'developer-laboratory',
    title: 'Developer Laboratory',
    subtitle: 'Experimental Sandbox & Technical Prototypes',
    description:
      'A curated collection of focused technical experiments, micro-utilities, reusable UI design tokens, state-machine prototypes, and exploratory AI workflow tests.',
    longDescription:
      'The Developer Laboratory represents my active sandbox where new architectural patterns and emerging web APIs are tested in isolation before being integrated into larger production architectures. Prototypes include lightweight canvas renderers, optimistic UI mutations, vector embedding search demonstrations, and custom accessibility-first UI primitives.',
    category: 'systems',
    categories: ['web', 'systems'],
    technologies: ['TypeScript', 'React', 'Canvas API', 'Node.js', 'Tailwind CSS'],
    coreTechnologies: ['React', 'TypeScript', 'Node.js', 'Canvas API'],
    status: 'Prototype',
    featured: true,
    keyFeatures: [
      'Interactive canvas particle simulation and force-directed node graphs',
      'Zero-dependency state machine implementations for complex multistep flows',
      'Miniature local vector cosine similarity search demonstration',
      'Modular custom keyboard shortcuts and accessible dialog controllers',
      'Micro-benchmarks for client-side bundle and hydration analysis'
    ],
    architectureOverview:
      'A monorepo setup containing standalone sandboxes with shared TypeScript configuration and styling primitives. Focused on minimal dependencies, zero build-step prototypes, and native web platform capabilities.',
    challengesAndLearnings:
      'Building custom canvas loops that render at 60fps on mobile without memory leaks. Deepened understanding of DOM accessibility trees and high-performance Web APIs.',
    githubUrl: 'https://github.com/vitejs/vite',
    demoUrl: 'https://demo-lab.example.com',
    accentColor: '#38BDF8',
    previewType: 'laboratory'
  }
];

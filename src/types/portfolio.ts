export type ProjectCategory = 'all' | 'ai' | 'web' | 'systems' | 'saved';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: 'ai' | 'web' | 'systems' | 'fullstack' | 'prototype';
  categories?: ('ai' | 'web' | 'systems')[];
  technologies: string[];
  coreTechnologies?: string[];
  status: 'Deployed' | 'In Development' | 'Prototype';
  featured: boolean;
  keyFeatures: string[];
  architectureOverview: string;
  challengesAndLearnings: string;
  githubUrl?: string;
  demoUrl?: string;
  accentColor: string;
  previewType: 'intravision' | 'tradepilot' | 'laboratory';
}

export interface SkillItem {
  name: string;
  context: string;
  iconName?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface JourneyMilestone {
  period: string;
  title: string;
  summary: string;
  learnings: string[];
  technologies: string[];
}

export interface CapabilityItem {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  icon: string;
  accent: string;
}

export interface DeveloperProfile {
  name: string;
  brandTag: string;
  role: string;
  availabilityBadge: string;
  headlinePrefix: string;
  headlineGradient: string;
  headlineSuffix: string;
  bioIntro: string;
  aboutStory: string[];
  coreValues: { title: string; desc: string }[];
  socials: {
    github: string;
    email: string;
    linkedin?: string;
    twitter?: string;
  };
}

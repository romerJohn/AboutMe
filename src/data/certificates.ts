export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerBadge: string;
  issueDate: string;
  credentialId: string;
  verificationUrl: string;
  category: 'All' | 'AI & Machine Learning' | 'Cloud & Systems' | 'Full-Stack Development';
  skills: string[];
  summary: string;
  isVerifiedPlaceholder: boolean;
  accentColor: string;
  grade?: string;
  hours?: string;
}

export const certificateCategories = [
  'All',
  'AI & Machine Learning',
  'Cloud & Systems',
  'Full-Stack Development'
] as const;

export const certificates: Certificate[] = [
  {
    id: 'deep-learning-specialization',
    title: 'Deep Learning & Neural Network Architectures',
    issuer: 'DeepLearning.AI',
    issuerBadge: 'DLAI',
    issueDate: 'October 2026',
    credentialId: 'DLAI-DL-882914-KR',
    verificationUrl: 'https://www.deeplearning.ai/verify?id=DLAI-DL-882914-KR',
    category: 'AI & Machine Learning',
    skills: ['Convolutional Networks', 'Transformers', 'Backpropagation', 'PyTorch', 'Vector Embeddings'],
    summary:
      'Rigorous mastery of multi-layer perceptrons, transformer self-attention mechanisms, regularization strategies, and deep generative models.',
    isVerifiedPlaceholder: true,
    accentColor: '#00E5FF',
    grade: 'Grade: 98.4%',
    hours: '120 Hours'
  },
  {
    id: 'gcp-cloud-architect',
    title: 'Professional Cloud Architect & Microservices',
    issuer: 'Google Cloud Platform',
    issuerBadge: 'GCP',
    issueDate: 'August 2026',
    credentialId: 'GCP-PCA-449102-KR',
    verificationUrl: 'https://cloud.google.com/certification?id=GCP-PCA-449102-KR',
    category: 'Cloud & Systems',
    skills: ['GCP Cloud Run', 'Distributed Storage', 'IAM Security', 'Kubernetes', 'High Availability'],
    summary:
      'Architecting resilient cloud infrastructures, containerized serverless microservices, virtual private clouds, and continuous CI/CD pipelines.',
    isVerifiedPlaceholder: true,
    accentColor: '#8B5CF6',
    grade: 'Score: Certified',
    hours: '160 Hours'
  },
  {
    id: 'meta-fullstack-engineer',
    title: 'Advanced Full-Stack TypeScript Systems',
    issuer: 'Meta Professional Certifications',
    issuerBadge: 'META',
    issueDate: 'May 2026',
    credentialId: 'META-FSE-209418-KR',
    verificationUrl: 'https://www.coursera.org/verify/professional-cert/META-FSE-209418-KR',
    category: 'Full-Stack Development',
    skills: ['React 19', 'TypeScript', 'State Management', 'REST API Design', 'Accessibility WCAG'],
    summary:
      'Comprehensive verification in building modern responsive single-page web applications, type-safe APIs, performance profiling, and test automation.',
    isVerifiedPlaceholder: true,
    accentColor: '#38BDF8',
    grade: 'Grade: 99.1%',
    hours: '140 Hours'
  },
  {
    id: 'vanderbilt-prompt-engineering',
    title: 'Generative AI Systems & Prompt Engineering',
    issuer: 'Vanderbilt University',
    issuerBadge: 'VAND',
    issueDate: 'March 2026',
    credentialId: 'VAND-GAI-710492-KR',
    verificationUrl: 'https://www.coursera.org/verify/VAND-GAI-710492-KR',
    category: 'AI & Machine Learning',
    skills: ['Few-Shot Prompting', 'Chain-of-Thought', 'Function Calling', 'RAG Pipelines', 'Safety Guardrails'],
    summary:
      'Advanced prompt patterns, programmatic agentic workflows, deterministic function-calling orchestration, and hallucination reduction methods.',
    isVerifiedPlaceholder: true,
    accentColor: '#10B981',
    grade: 'Grade: 100%',
    hours: '80 Hours'
  },
  {
    id: 'database-systems-postgresql',
    title: 'Modern Database Architecture & PostgreSQL Optimization',
    issuer: 'Database Engineering Institute',
    issuerBadge: 'DBEI',
    issueDate: 'January 2026',
    credentialId: 'DBEI-PGSQL-391820-KR',
    verificationUrl: 'https://dbei.org/credentials/DBEI-PGSQL-391820-KR',
    category: 'Cloud & Systems',
    skills: ['PostgreSQL Internals', 'Query Planner Tuning', 'WAL & Replication', 'ACID Transactions'],
    summary:
      'In-depth study of relational indexing strategies, concurrency isolation levels, deadlock prevention, and high-throughput connection pooling.',
    isVerifiedPlaceholder: true,
    accentColor: '#F59E0B',
    grade: 'Grade: 96.8%',
    hours: '90 Hours'
  }
];

export type PageRoute =
  | 'home'
  | 'work'
  | 'services'
  | 'about'
  | 'faq'
  | 'contact'
  | 'submissions'
  | 'privacy'
  | 'terms';

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  services: string[];
  description: string;
  liveUrl?: string;
  featured: boolean;
  image: string;
  imageAlt: string;
  palette: string[];
  techStack: string[];
  overview: string;
  deliverables: string[];
  metrics?: { label: string; value: string }[];
  impact?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  toolsAndTech: string[];
  bestFor: string;
  highlights?: string[];
}

export interface ProcessPhase {
  number: string;
  title: string;
  timeline: string;
  description: string;
  deliverables: string[];
  iconName: string;
}

export interface EngagementPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  priceDescriptor: string;
  description: string;
  features: string[];
  idealFor: string;
  ctaText: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  project: string;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Process' | 'Development' | 'Engagement';
}

export interface ContactFormData {
  engagementType: 'project' | 'retainer';
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  existingUrl?: string;
  budgetRange?: string;
  serviceRequired: string[];
  projectBrief: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  referenceId: string;
  timestamp: string;
  details?: {
    fullName: string;
    company: string;
    email: string;
    serviceRequired: string[];
    engagementType?: string;
    budgetRange?: string;
  };
  error?: string;
}


import { ProcessPhase, EngagementPlan, Testimonial } from '../types';

export const PROCESS_PHASES: ProcessPhase[] = [
  {
    number: '01',
    title: 'Blueprint',
    timeline: '1–2 Weeks',
    description:
      'We begin with in-depth research and strategic scoping. We analyze your market, study competitor benchmarks, define core user journeys, and architect the foundational sitemap and wireframes before touching visual styling.',
    deliverables: [
      'Product & Market Competitor Audit',
      'User Personas & Journey Flow Maps',
      'Information Architecture & Sitemaps',
      'Low-Fidelity Structural Wireframes',
      'Technical Scope & Milestone Roadmap',
    ],
    iconName: 'Compass',
  },
  {
    number: '02',
    title: 'Spark',
    timeline: '1–2 Weeks',
    description:
      'The creative exploration phase. We develop bespoke visual concepts, typography scales, design systems, and high-fidelity interactive Figma prototypes to establish your product’s unmistakable brand presence.',
    deliverables: [
      'Art Direction & Visual Moodboards',
      'Interactive High-Fidelity UI Prototypes',
      'Design Tokens & Color/Type Hierarchy',
      'Micro-Interactions & Animation Specs',
      'Collaborative Design Review Rounds',
    ],
    iconName: 'Sparkles',
  },
  {
    number: '03',
    title: 'Build',
    timeline: 'Production & Launch',
    description:
      'The same multidisciplinary team engineers your frontend into clean, responsive, production-ready code. Pixel-perfect implementation in modern React, Next.js, or Framer with sub-second performance.',
    deliverables: [
      'Production-Ready React / Next.js / Framer Code',
      'Component Library & Design System Tokens',
      '95+ Core Web Vitals Performance Audit',
      'Cross-Device & Browser QA Testing',
      'Seamless Domain Deployment & Warranty',
    ],
    iconName: 'Terminal',
  },
];

export const ENGAGEMENT_PLANS: EngagementPlan[] = [
  {
    id: 'project-based',
    name: 'Project-Based',
    tagline: 'Dedicated sprint from concept to launch',
    badge: 'FLAGSHIP LAUNCH',
    priceDescriptor: 'Fixed Scope & Timeline',
    description:
      'Perfect for companies launching a new product, rebuilding their core digital flagship, or needing an end-to-end design & frontend delivery.',
    features: [
      'Complete 3-Phase Process (Blueprint, Spark, Build)',
      'Bespoke UI/UX design & interactive prototype in Figma',
      'Production-grade responsive web frontend (React / Next.js)',
      'Sub-second page speed & 95+ Core Web Vitals optimization',
      'Direct communication with studio founders (no account managers)',
      '2 rounds of revisions per milestone',
      '30-day post-launch warranty and handoff training',
    ],
    idealFor: 'Startups and brands with a defined scope, clear deadline, and launch milestone.',
    ctaText: 'Start a Project Brief',
    popular: true,
  },
  {
    id: 'monthly-retainer',
    name: 'Design Retainer',
    tagline: 'Continuous design & frontend bandwidth',
    badge: 'DEDICATED PARTNERSHIP',
    priceDescriptor: 'Monthly Bandwidth Sprint',
    description:
      'An embedded creative partner for fast-moving teams who need continuous UI/UX design, new feature rollouts, and ongoing frontend polish.',
    features: [
      'Dedicated monthly design & frontend engineering hours',
      'Continuous UI/UX design, landing pages, and components',
      'Rapid turnaround (typically 48–72h for sprint tasks)',
      'Private Slack / Discord channel with direct founder access',
      'Weekly priority sync and asynchronous Loom reviews',
      'Flexible scope — adjust priorities week by week',
      'Pause or cancel anytime with 14-day notice',
    ],
    idealFor: 'Funded tech startups, SaaS teams, and agencies needing high-caliber continuous support.',
    ctaText: 'Inquire for Retainer',
    popular: false,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'vyvhr-testimonial',
    quote:
      'Hutchforge delivered our new web platform ahead of schedule. Their ability to translate complex human-capital enterprise workflows into an intuitive, razor-sharp visual language resulted in an immediate 180% surge in qualified demo requests.',
    author: 'Marcus Vance',
    role: 'Co-Founder & Chief Product Officer',
    company: 'VYVHR International',
    project: 'VYVHR Platform Launch',
  },
  {
    id: 'kinetic-testimonial',
    quote:
      'Working with Hutchforge felt like having an elite internal design team. They don’t just make things look gorgeous — they understand engineering constraints, WebGL performance, and user psychology. Zero agency fluff.',
    author: 'Dr. Elena Rostova',
    role: 'Head of Robotics & Research',
    company: 'Kinetic Dynamics',
    project: 'Kinetic Lab Showcase',
  },
  {
    id: 'aetherium-testimonial',
    quote:
      'The typographic discipline and spatial restraint Hutchforge brought to our digital archive was unmatched. They made our architectural models feel visceral and commanding on both desktop and mobile.',
    author: 'Julian Thorne',
    role: 'Principal Partner',
    company: 'Aetherium Spatial Research',
    project: 'Aetherium Digital Flagship',
  },
];

export const TECH_MARQUEE = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Figma', category: 'Design System' },
  { name: 'Framer', category: 'Prototyping & Web' },
  { name: 'WebGL', category: '3D Graphics' },
  { name: 'Three.js', category: 'Interactive Canvas' },
  { name: 'Supabase', category: 'Database' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'Motion', category: 'Animation' },
  { name: 'Vercel', category: 'Deployment' },
];

export const STATS = [
  { value: '100%', label: 'Focused Execution', detail: 'Disciplined sprint delivery' },
  { value: '98+', label: 'Lighthouse Speed', detail: 'Optimized Core Web Vitals' },
];

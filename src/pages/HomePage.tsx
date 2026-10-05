import React, { useState } from 'react';
import { PageRoute } from '../types';
import { PROJECTS } from '../data/projects';
import { SERVICES } from '../data/services';
import { PROCESS_PHASES, ENGAGEMENT_PLANS } from '../data/studioData';
import { FAQS } from '../data/faq';
import { MetallicHero } from '../components/MetallicHero';
import { StaggeredHeading, StaggeredBadge } from '../components/TextReveal';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Layers,
  Compass,
  Terminal,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Globe,
  ChevronDown,
  Share2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [openFaqIds, setOpenFaqIds] = useState<string[]>([]);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const phaseIcons = [Compass, Sparkles, Terminal];
  const serviceIcons = [Layers, Compass, Terminal, Globe, Sparkles, Share2];
  const displayedProjects = showAllProjects ? PROJECTS : PROJECTS.slice(0, 2);

  return (
    <div className="relative w-full bg-[#000000] text-[#F5F5F5] selection:bg-[#1368e6] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: 3D Ribbed Metallic Cinematic Canvas                       */}
      {/* ========================================================================= */}
      <section className="relative w-full">
        <MetallicHero onNavigate={onNavigate} />
      </section>

      {/* ========================================================================= */}
      {/* 2. SERVICES & DISCIPLINES: End-to-End Digital Craft                       */}
      {/* ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#050505] border-t border-white/10">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <StaggeredBadge className="mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/20 text-[11px] font-mono text-[#93c5fd]">
                  <Layers className="w-3.5 h-3.5 text-[#1368e6]" />
                  <span>SERVICES & DISCIPLINES</span>
                </div>
              </StaggeredBadge>
              <StaggeredHeading
                text="End-to-End Digital Craft"
                as="h2"
                className="text-2xl sm:text-[28px] font-extrabold uppercase tracking-tight text-white font-sans"
              />
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="btn-pill-secondary text-xs self-start md:self-end cursor-pointer"
            >
              <span>Explore All Services</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length] || Layers;
              return (
                <div
                  key={service.id}
                  className="bento-card p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#0a0a0a] border border-white/10 hover:border-[#1368e6]/40 transition-all duration-300 h-full shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#1368e6]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-white/40">
                        0{index + 1} // DISCIPLINE
                      </span>
                    </div>

                    <StaggeredHeading
                      text={service.title}
                      as="h3"
                      delay={0.1 + index * 0.05}
                      className="text-2xl font-bold text-white tracking-tight"
                    />

                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {service.deliverables.slice(0, 4).map((d, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-white/80 bg-white/[0.02] p-2 rounded-lg border border-white/5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1368e6] shrink-0 mt-0.5" />
                          <span className="text-[11px]">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {service.toolsAndTech.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 text-[11px] font-mono bg-white/5 border border-white/10 text-white/70 rounded-md"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WORKFLOW: The 3-Phase Workflow                                         */}
      {/* ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#ECECEC] text-[#111111] border-t border-neutral-300">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="border-b border-black/10 pb-8">
            <StaggeredBadge className="mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[11px] font-mono text-neutral-800">
                <Compass className="w-3.5 h-3.5 text-[#1368e6]" />
                <span>THE 3-PHASE WORKFLOW</span>
              </div>
            </StaggeredBadge>
            <StaggeredHeading
              text="From Research to Launch"
              as="h2"
              className="text-2xl sm:text-[28px] font-extrabold uppercase tracking-tight text-[#111111] font-sans"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS_PHASES.map((phase, idx) => {
              const Icon = phaseIcons[idx];
              return (
                <div
                  key={phase.number}
                  className="rounded-[28px] p-7 sm:p-8 flex flex-col justify-between space-y-6 relative group bg-white text-[#111111] border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 h-full shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center text-neutral-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-2xl font-black text-neutral-400 group-hover:text-neutral-900 transition-colors font-mono">
                        {phase.number}
                      </span>
                    </div>

                    <StaggeredHeading
                      text={phase.title}
                      as="h3"
                      delay={0.1 + idx * 0.05}
                      className="text-2xl font-extrabold text-[#111111] tracking-tight"
                    />

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                      {phase.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-black/10">
                      <ul className="space-y-1.5">
                        {phase.deliverables.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-neutral-700 font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-black/5 group-hover:bg-neutral-900 group-hover:text-white text-neutral-800 flex items-center justify-center transition-all duration-300 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SELECTED WORK: Projects We're Proud Of                                 */}
      {/* ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#020202] border-t border-white/10">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          {/* Section Header */}
          <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <StaggeredBadge className="mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/25 text-[11px] font-mono text-[#93c5fd]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1368e6]" />
                  <span>CURATED RECENT COMMISSIONS</span>
                </div>
              </StaggeredBadge>
              <StaggeredHeading
                text="Projects we're proud of."
                as="h2"
                className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-white font-sans"
              />
            </div>
            <button
              onClick={() => onNavigate('work')}
              className="btn-pill-secondary text-xs self-start md:self-end cursor-pointer"
            >
              <span>View All Commissions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {displayedProjects.map((project) => (
              <a
                key={project.id}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-[#1368e6]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(19,104,230,0.22)] hover:-translate-y-1 cursor-pointer h-full"
              >
                {/* Real Website Hero Mockup Preview */}
                <div className="relative overflow-hidden bg-[#000000]">
                  {/* Browser Bar */}
                  <div className="px-4 py-3 bg-[#111111] border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-[12px] font-mono text-white/80 truncate">
                      {project.liveUrl}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                  </div>

                  {/* Hero Image Preview */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-[#0a0a0a]">
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=80';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity pointer-events-none" />

                    <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono text-white flex items-center gap-2 shadow-lg z-20">
                      <Globe className="w-3.5 h-3.5 text-[#1368e6]" />
                      <span>{getDomain(project.liveUrl)}</span>
                    </div>
                  </div>
                </div>

                {/* Real Website Info & Direct Link */}
                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between bg-[#0a0a0a]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#60a5fa] transition-colors">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-white/70 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-white/50">
                      Live Flagship • Production
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1368e6] group-hover:text-white transition-colors">
                      <span>Visit Website</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Small Explore More / See More Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center pt-4">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#0d0d0d] hover:bg-[#1368e6] border border-white/20 hover:border-[#1368e6] text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_24px_rgba(19,104,230,0.5)] cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1368e6] group-hover:text-white transition-colors" />
              <span>{showAllProjects ? 'Show Less Projects' : `Explore More Projects (${PROJECTS.length - 2} More)`}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  showAllProjects ? 'rotate-180 text-white' : 'text-white/60 group-hover:text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRICING & COLLABORATION: Transparent Engagement                        */}
      {/* ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#040404] border-t border-white/10">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="border-b border-white/10 pb-8">
            <StaggeredBadge className="mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/20 text-[11px] font-mono text-[#93c5fd]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1368e6]" />
                <span>COLLABORATION MODELS</span>
              </div>
            </StaggeredBadge>
            <StaggeredHeading
              text="Transparent Engagement"
              as="h2"
              className="text-2xl sm:text-[28px] font-extrabold uppercase tracking-tight text-white font-sans"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {ENGAGEMENT_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden h-full shadow-xl ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#141414] to-[#0c0c0c] border-2 border-[#1368e6]/60 shadow-[0_0_40px_rgba(19,104,230,0.18)]'
                    : 'bg-[#0c0c0c] border border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-6 px-3 py-1 rounded-full bg-[#1368e6] text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <StaggeredHeading
                      text={plan.name}
                      as="h3"
                      delay={0.1}
                      className="text-3xl font-extrabold text-white tracking-tight"
                    />
                    <p className="text-xs font-mono text-white/50">{plan.tagline}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-sm font-mono text-white/80 font-bold">
                      {plan.priceDescriptor}
                    </div>
                    <p className="text-xs text-white/60 mt-1">{plan.description}</p>
                  </div>

                  <div className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80"
                      >
                        <Check className="w-4 h-4 text-[#1368e6] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => onNavigate('contact')}
                    className={`w-full justify-center text-sm py-3.5 cursor-pointer ${
                      plan.popular ? 'btn-pill-primary' : 'btn-pill-secondary'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FAQ: Frequently Asked Questions                                        */}
      {/* ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#000000] border-t border-white/10">
        <div className="max-w-4xl mx-auto w-full space-y-12">
          <div className="border-b border-white/10 pb-8">
            <StaggeredBadge className="mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/20 text-[11px] font-mono text-[#93c5fd]">
                <Sparkles className="w-3.5 h-3.5 text-[#1368e6]" />
                <span>COMMON INQUIRIES</span>
              </div>
            </StaggeredBadge>
            <StaggeredHeading
              text="Frequently Asked Questions"
              as="h2"
              className="text-2xl sm:text-[28px] font-extrabold uppercase tracking-tight text-white font-sans"
            />
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.slice(0, 5).map((faq, index) => {
              const isOpen = openFaqIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="py-6 transition-colors duration-300 hover:bg-white/[0.015] px-2 rounded-xl"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-start justify-between text-left gap-4 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-white/30 shrink-0 pt-0.5">
                        0{index + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                        {faq.question}
                      </h3>
                    </div>

                    <span className="p-1 rounded-full bg-white/5 border border-white/10 text-white/60 shrink-0 mt-0.5 group-hover:border-[#1368e6]">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 pl-8 text-xs sm:text-sm text-white/60 leading-relaxed font-light"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => onNavigate('faq')}
              className="btn-pill-secondary text-xs px-6 py-3 cursor-pointer"
            >
              <span>View All FAQ & Process Protocols</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

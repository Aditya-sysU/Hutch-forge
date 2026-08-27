import React from 'react';
import { PageRoute } from '../types';
import { PROJECTS } from '../data/projects';
import { ExternalLink, ArrowUpRight, Sparkles, Globe } from 'lucide-react';

interface WorkPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function WorkPage({ onNavigate }: WorkPageProps) {
  return (
    <div className="w-full pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#000000] min-h-screen text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="border-b border-white/10 pb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/20 text-[11px] font-mono text-[#93c5fd]">
            <Sparkles className="w-3.5 h-3.5 text-[#1368e6]" />
            <span>SELECTED CLIENT COMMISSIONS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white font-sans">
            Projects we're proud of.
          </h1>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <a
              key={project.id}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-[#1368e6]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(19,104,230,0.2)] hover:-translate-y-1 cursor-pointer h-full"
            >
              {/* Image Preview & Browser Mockup */}
              <div className="relative overflow-hidden bg-[#000000]">
                <div className="px-4 py-3 bg-[#111111] border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-[12px] font-mono text-white/80 truncate">
                    {project.id === 'vyvhr' ? 'https://vyvhr.com' : 'https://driftwoodpizzaandsubs.com'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                </div>

                {/* Real Website Image Preview */}
                <div className="aspect-[16/10] overflow-hidden relative bg-[#0a0a0a]">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity pointer-events-none" />

                  <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono text-white flex items-center gap-2 shadow-lg z-20">
                    <Globe className="w-3.5 h-3.5 text-[#1368e6]" />
                    <span>{project.id === 'vyvhr' ? 'vyvhr.com' : 'driftwoodpizzaandsubs.com'}</span>
                  </div>
                </div>
              </div>

              {/* Card Meta & Content */}
              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between bg-[#0a0a0a]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
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
                    <span>Visit Live Website</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Start a Project Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#080808] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              Ready to commission your digital flagship?
            </h3>
            <p className="text-xs font-mono text-white/50">
              Direct engagements with founders and design leadership.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 transition-all cursor-pointer shadow-lg"
          >
            <span>Start a Project Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { PageRoute } from '../types';
import { SERVICES } from '../data/services';
import { PROCESS_PHASES } from '../data/studioData';
import { CheckCircle2, ArrowUpRight, Cpu, Layers, Terminal, Compass, Sparkles } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const icons = [Layers, Compass, Terminal, Cpu, Sparkles];

  return (
    <div className="w-full pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#000000] min-h-screen text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Page Header */}
        <div className="border-b border-white/10 pb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/20 text-[11px] font-mono text-[#93c5fd]">
            <Layers className="w-3.5 h-3.5 text-[#1368e6]" />
            <span>DISCIPLINES & TECHNICAL CAPABILITIES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white font-sans">
            Capabilities & Services
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl leading-relaxed font-light">
            We operate at the precise intersection of creative direction, interface architecture, and modern frontend engineering.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((service, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="bento-card p-8 sm:p-10 flex flex-col justify-between space-y-8 h-full bg-[#0a0a0a] border border-white/10 hover:border-[#1368e6]/50 transition-all"
                >
                  <div className="space-y-6">
                    {/* Discipline Header */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#1368e6]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-white/40">
                        0{index + 1} // DISCIPLINE
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {service.title}
                      </h2>
                      <p className="text-xs font-mono text-[#93c5fd] font-medium">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      {service.description}
                    </p>

                    {/* Tangible Deliverables Checklist */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
                        Tangible Deliverables:
                      </span>
                      <div className="space-y-2">
                        {service.deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-white/80 p-2.5 bg-white/[0.02] border border-white/5 rounded-xl"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#1368e6] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tech stack & Best for */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="text-xs text-white/50">
                      <span className="font-mono text-[10px] text-white/40 uppercase block mb-1 font-semibold tracking-wider">
                        IDEAL APPLICATION:
                      </span>
                      {service.bestFor}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.toolsAndTech.map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 text-[11px] font-mono bg-white/5 border border-white/10 text-white/80 rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The 3-Phase Workflow section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090909] border border-white/10 space-y-12">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-[#93c5fd] uppercase tracking-wider">
              INTEGRATED SPRINT WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              The 3-Phase Delivery Method
            </h2>
            <p className="text-xs sm:text-sm text-white/60 font-light">
              Every engagement follows our battle-tested Blueprint, Spark, and Build workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS_PHASES.map((phase) => (
              <div
                key={phase.number}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-xl font-bold text-[#1368e6]">{phase.number}</span>
                  <span className="text-white/40">{phase.timeline}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Principles Grid */}
        <div className="space-y-6">
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest">
            // ENGINEERING & DESIGN QUALITY BENCHMARKS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 bento-card space-y-3 h-full">
              <div className="text-xs font-mono text-[#1368e6] font-bold">01 // MATHEMATICAL HIERARCHY</div>
              <h3 className="text-lg font-bold text-white uppercase">Typography & Grid</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                We use strict scale ratios and structured grid units. No arbitrary font sizes or random margins.
              </p>
            </div>

            <div className="p-6 sm:p-8 bento-card space-y-3 h-full">
              <div className="text-xs font-mono text-[#1368e6] font-bold">02 // PERFORMANCE FIRST</div>
              <h3 className="text-lg font-bold text-white uppercase">Sub-Second Loads</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Optimized assets, minimal script overhead, and high Core Web Vitals scores by default.
              </p>
            </div>

            <div className="p-6 sm:p-8 bento-card space-y-3 h-full">
              <div className="text-xs font-mono text-[#1368e6] font-bold">03 // DIRECT ARCHITECTURE</div>
              <h3 className="text-lg font-bold text-white uppercase">No Middleware Bloat</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Clean TypeScript code, native web standards, and bulletproof responsive foundations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#080808] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              Need a tailored capability set?
            </h3>
            <p className="text-xs font-mono text-white/50">
              We scope custom deliverables according to your technical roadmap.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 transition-all cursor-pointer shadow-xl"
          >
            <span>Request a Custom Scope</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

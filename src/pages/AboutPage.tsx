import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Sparkles, Check, Layers, Compass, Code2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="w-full pt-32 sm:pt-40 pb-24 px-5 sm:px-8 lg:px-12 bg-[#000000] min-h-screen text-[#F5F5F5]">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Main Section */}
        <div className="space-y-6 border-b border-white/10 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/25 text-xs font-mono text-[#93c5fd] lowercase">
            <Sparkles className="w-3.5 h-3.5 text-[#1368e6]" />
            <span>about hutchforge</span>
          </div>

          <h1 className="text-[26px] font-extrabold tracking-tight text-white lowercase font-sans">
            about hutchforge
          </h1>

          {/* Primary Statement */}
          <div className="space-y-4 text-sm text-white/80 leading-relaxed font-light">
            <p className="text-sm font-semibold text-white">
              hutchforge builds websites for brands that care about how they show up.
            </p>
            <p className="text-sm text-white/70">
              From UI/UX and web design to development and landing pages, we bring the visual and functional parts of a website together in one place.
            </p>
            <p className="text-sm text-white/70">
              We keep things clear, considered, and built around the brand, not unnecessary features or crowded design.
            </p>
          </div>
        </div>

        {/* Audience & Scope */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-12">
          <div className="md:col-span-4 space-y-1">
            <span className="text-xs font-mono text-[#1368e6] font-semibold uppercase">
              01 // AUDIENCE
            </span>
            <h2 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
              Who We Partner With
            </h2>
          </div>

          <div className="md:col-span-8 space-y-4 text-sm text-white/70 font-light leading-relaxed">
            <p className="text-sm text-white font-normal">
              We partner with growing businesses that want their online presence to match the quality of what they do.
            </p>
            <p className="text-sm text-white/60">
              Whether you are launching a new site, refreshing an established brand, or developing focused landing pages, we work alongside you to deliver a crisp, reliable, and high-performing digital flagship.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                Growing Businesses
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                Website Redesigns
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                High-Conversion Landing Pages
              </span>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-12">
          <div className="md:col-span-4 space-y-1">
            <span className="text-xs font-mono text-[#1368e6] font-semibold uppercase">
              02 // PRINCIPLES
            </span>
            <h2 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
              Our Core Standards
            </h2>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1368e6]" />
                Design with purpose
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light pl-3.5">
                Every layout, font choice, and interaction exists to communicate your message clearly and guide visitors naturally.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1368e6]" />
                Built to work
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light pl-3.5">
                Engineered with modern frontend standards, fast load times, responsive precision across all screens, and maintainable code.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1368e6]" />
                Direct collaboration
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light pl-3.5">
                Work directly with the people designing and coding your project. No intermediaries, no diluted feedback, and no wasted motion.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <h3 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
              Ready to start your project?
            </h3>
            <p className="text-sm text-white/60 font-light">
              Submit your project brief and our team will reach out to you shortly.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="btn-pill-primary text-xs py-3 px-6 cursor-pointer shrink-0"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

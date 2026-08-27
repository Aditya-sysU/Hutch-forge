import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Clock, Globe, Sparkles, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  className?: string;
}

export function Footer({ onNavigate, className = '' }: FooterProps) {
  const [istTime, setIstTime] = useState('');

  // Real-time Indian Standard Time (IST, UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setIstTime(formatted.toUpperCase() + ' IST');
      } catch (e) {
        setIstTime('03:00:00 PM IST');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (route: PageRoute) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`w-full bg-[#000000] text-white/70 border-t border-white/15 py-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden flex flex-col justify-center ${className}`}
    >
      {/* Background Deep Blue Volumetric Glow Identical to Hero */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-[#1368e6]/20 via-[#0a3080]/10 to-black pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#1368e6]/15 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-16 relative z-10 my-auto">
        {/* Top Section: Interactive Project Callout Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#080808]/90 backdrop-blur-md hover:bg-[#0c0c0c] border border-white/15 hover:border-[#1368e6]/40 transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/15 border border-[#1368e6]/30 text-[11px] font-mono text-[#93c5fd]">
              <Sparkles className="w-3 h-3 text-[#1368e6]" />
              <span>LET'S BUILD SOMETHING EXTRAORDINARY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Have a project in mind?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-light">
              We partner with founders and product teams worldwide. Start a conversation or submit a brief to get started.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => handleNav('contact')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold tracking-wide transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Start a Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href="mailto:direct@hutchforge.studio"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white text-xs font-medium transition-all duration-300 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-white/60" />
              <span>direct@hutchforge.studio</span>
            </a>
          </div>
        </div>

        {/* Middle Section: Studio Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pt-6">
          {/* Exact Brand Logo & Wordmark */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none transition-transform hover:scale-105 text-left"
              aria-label="Hutchforge Home"
            >
              {/* Fluid stylized double-arc logo icon */}
              <div className="w-8 h-8 rounded-full bg-[#0d0d0d] border border-white/15 flex items-center justify-center group-hover:border-[#1368e6] group-hover:bg-[#1368e6]/10 transition-all shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-white group-hover:text-[#60a5fa] transition-colors"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14c2-4 5-6 8-6s6 2 8 6" />
                  <path d="M4 18c2-4 5-6 8-6s6 2 8 6" />
                </svg>
              </div>
              <span className="font-black text-[17px] tracking-[-0.04em] text-white lowercase font-sans">
                hutchforge
              </span>
            </button>

            <p className="text-xs sm:text-sm text-white/60 max-w-sm leading-relaxed font-light">
              A specialized creative digital studio crafting category-defining websites, UI/UX systems, and interactive digital platforms with engineering precision.
            </p>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              // DIRECTORY
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('work')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-white/70 inline-block"
                >
                  Selected Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-white/70 inline-block"
                >
                  Capabilities & Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-white/70 inline-block"
                >
                  About the Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-white/70 inline-block"
                >
                  FAQ & Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('submissions')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-white/70 inline-block"
                >
                  Intake Submissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#60a5fa] text-[#1368e6] transition-colors cursor-pointer flex items-center gap-1 font-semibold pt-1"
                >
                  Start a Project <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              // CONNECT
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-white/70">
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1"
                >
                  <span>X / Twitter</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Real IST Live Clock & Coordinates */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              // TIMEZONE
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-white bg-white/[0.04] border border-white/10 px-3 py-2 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-[#1368e6]" />
                <span className="font-semibold text-[11px]">{istTime || 'IST LIVE'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-[11px] px-1">
                <Globe className="w-3 h-3 text-white/30" />
                <span>Asia/Kolkata (UTC+5:30)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/40">
          <div>
            © {new Date().getFullYear()} HUTCHFORGE STUDIO. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleNav('privacy')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              Privacy Policy
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

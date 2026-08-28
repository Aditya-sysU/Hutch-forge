import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Clock, Globe, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  className?: string;
}

export function Footer({ onNavigate, className = '' }: FooterProps) {
  const [istTime, setIstTime] = useState('');

  // Real-time Indian Standard Time (IST, Asia/Kolkata, UTC+5:30)
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
      } catch {
        setIstTime('07:41:49 AM IST');
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
      className={`w-full bg-[#ECECEC] text-[#111111] border-t border-neutral-300 relative overflow-hidden flex flex-col justify-between pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-20 select-none min-h-[580px] lg:min-h-[640px] ${className}`}
    >
      {/* 1. Subtle Architectural Grid & Ambient Gradient Overlays (Matching 'Research to Launch' Palette) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Soft atmospheric warm gray & ambient glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[350px] bg-radial-[circle_at_center] from-black/[0.04] via-black/[0.015] to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[300px] bg-radial-[circle_at_bottom_right] from-[#1368e6]/[0.05] via-transparent to-transparent blur-2xl pointer-events-none" />

        {/* Subtle grid pattern overlay for editorial craft */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />
      </div>

      {/* 2. Structured Multi-Column Studio Navigation (Light Theme, Black Text, Behance Social Button) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mb-16 sm:mb-20 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Column 1: Brand & Bio (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <BrandLogo onClick={() => handleNav('home')} size="large" theme="light" />
            
            <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed font-normal max-w-md">
              A specialized creative digital studio crafting category-defining websites, UI/UX systems, and interactive digital platforms with engineering precision.
            </p>
          </div>

          {/* Column 2: Directory (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[12px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
              DIRECTORY
            </div>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => handleNav('work')}
                  className="text-neutral-800 hover:text-black hover:translate-x-1 transition-all cursor-pointer block"
                >
                  Selected Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="text-neutral-800 hover:text-black hover:translate-x-1 transition-all cursor-pointer block"
                >
                  Capabilities & Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-neutral-800 hover:text-black hover:translate-x-1 transition-all cursor-pointer block"
                >
                  About the Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="text-neutral-800 hover:text-black hover:translate-x-1 transition-all cursor-pointer block"
                >
                  FAQ & Process
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => handleNav('contact')}
                  className="text-[#1368e6] hover:text-[#0f54b9] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 group"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[12px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
              CONTACT
            </div>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a
                  href="mailto:hello@hutchforge.com"
                  className="inline-flex items-center gap-2.5 text-neutral-800 hover:text-[#1368e6] group transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-[#1368e6] group-hover:bg-[#1368e6] group-hover:text-white transition-all shadow-sm shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-xs sm:text-[13px] break-all sm:break-normal">hello@hutchforge.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+918700061944"
                  className="inline-flex items-center gap-2.5 text-neutral-800 hover:text-[#1368e6] group transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-[#1368e6] group-hover:bg-[#1368e6] group-hover:text-white transition-all shadow-sm shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-mono font-semibold text-xs sm:text-[13px] tracking-wide">+91 8700061944</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Timezone & Studio Location (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-[12px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
              TIMEZONE
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 border border-black/10 text-xs font-mono text-[#111111] shadow-sm backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-[#1368e6] shrink-0" />
                <span className="font-semibold">{istTime || '07:41:49 AM IST'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-600 text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Asia/Kolkata (UTC+5:30)</span>
              </div>
            </div>
          </div>

          {/* Column 5: Social Action (lg:col-span-1) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="text-[12px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
              SOCIALS
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.behance.net/kartikmishra14"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance Profile"
                className="w-10 h-10 rounded-full bg-[#1368e6] hover:bg-[#0f54b9] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_4px_16px_rgba(19,104,230,0.3)] cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.062 0-5.625-2.859-5.625-5.625 0-3.328 1.953-5.625 5.547-5.625 3.734 0 5.188 2.5 5.188 5.172 0 .641-.047 1.078-.078 1.484h-7.875c.094 1.703 1.25 2.547 2.875 2.547 1.453 0 2.219-.719 2.578-1.578h2.492zm-2.812-4.125c-.094-1.219-.781-2.281-2.344-2.281-1.469 0-2.281 1.016-2.438 2.281h4.782zm-12.914 7.125h-8v-16h7.797c3.563 0 5.453 1.625 5.453 4.672 0 1.844-.922 3.172-2.312 3.844 1.844.625 2.875 2.141 2.875 4.266 0 3.516-2.203 3.218-5.813 3.218zm-4.781-9.438h4.484c1.5 0 2.547-.641 2.547-1.922 0-1.25-.953-1.844-2.484-1.844h-4.547v3.766zm0 6.641h4.641c1.719 0 2.859-.75 2.859-2.188 0-1.5-.969-2.219-2.734-2.219h-4.766v4.407z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Row (Matching Light Stone Palette & Black Text) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600 uppercase tracking-wider">
        <div>
          © 2026 HUTCHFORGE STUDIO. ALL RIGHTS RESERVED.
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNav('privacy')}
            className="hover:text-black transition-colors cursor-pointer"
          >
            PRIVACY POLICY
          </button>
          <span>•</span>
          <button
            onClick={() => handleNav('terms')}
            className="hover:text-black transition-colors cursor-pointer"
          >
            TERMS OF SERVICE
          </button>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavigationProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export function Navigation({ currentRoute, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If we are on the home page, check if scroll passed the hero section height (approx ~85% of window height or 700px)
      if (currentRoute === 'home') {
        const threshold = window.innerHeight * 0.85;
        setIsPastHero(window.scrollY > threshold);
      } else {
        // On non-home pages without the large hero canvas, keep light/white styling active
        setIsPastHero(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentRoute]);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Floating Header with Dynamic Theme Transition */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3.5 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-3.5 md:py-4 pointer-events-none transition-all duration-500 ${
          isPastHero
            ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        }`}
      >
        
        {/* Left: Studio Brand & Logo */}
        <div className="pointer-events-auto flex-shrink-0">
          <BrandLogo
            onClick={() => handleNavClick('home')}
            size="nav"
            theme={isPastHero ? 'light' : 'dark'}
          />
        </div>

        {/* Center: Aesthetic Minimalist Navigation Capsule */}
        <nav
          aria-label="Main Navigation"
          className={`pointer-events-auto hidden md:flex items-center p-1 sm:p-1.5 rounded-full transition-all duration-300 justify-center max-w-sm ${
            isPastHero
              ? 'bg-[#F0F0F0] border border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.05)]'
              : 'bg-[#0a0a0a]/85 backdrop-blur-xl border border-white/[0.1] shadow-[0_12px_36px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]'
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-around px-1">
            <button
              onClick={() => handleNavClick('about')}
              className={`relative flex-1 text-center px-4 lg:px-6 py-1.5 lg:py-2 rounded-full text-xs tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isPastHero
                  ? currentRoute === 'about'
                    ? 'text-white bg-[#111111] font-semibold shadow-sm'
                    : 'text-neutral-700 hover:text-black hover:bg-black/5 font-medium'
                  : currentRoute === 'about'
                  ? 'text-white bg-white/[0.12] font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('work')}
              className={`relative flex-1 text-center px-4 lg:px-6 py-1.5 lg:py-2 rounded-full text-xs tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isPastHero
                  ? currentRoute === 'work'
                    ? 'text-white bg-[#111111] font-semibold shadow-sm'
                    : 'text-neutral-700 hover:text-black hover:bg-black/5 font-medium'
                  : currentRoute === 'work'
                  ? 'text-white bg-white/[0.12] font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              Work
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`relative flex-1 text-center px-4 lg:px-6 py-1.5 lg:py-2 rounded-full text-xs tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isPastHero
                  ? currentRoute === 'services'
                    ? 'text-white bg-[#111111] font-semibold shadow-sm'
                    : 'text-neutral-700 hover:text-black hover:bg-black/5 font-medium'
                  : currentRoute === 'services'
                  ? 'text-white bg-white/[0.12] font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              Services
            </button>
          </div>
        </nav>

        {/* Right: CTA Pill Button "✦ Start a project" with Blue Hover */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">
          <button
            onClick={() => handleNavClick('contact')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-[11px] sm:text-xs md:text-sm tracking-tight sm:tracking-normal transition-all duration-300 cursor-pointer active:scale-95 whitespace-nowrap flex-shrink-0 group ${
              isPastHero
                ? 'bg-[#111111] hover:bg-[#1368e6] border border-black/10 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(19,104,230,0.4)]'
                : 'bg-[#000000] hover:bg-[#1368e6] border border-white/20 hover:border-[#1368e6] text-white shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_28px_rgba(19,104,230,0.6)]'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1368e6] group-hover:text-white group-hover:rotate-12 transition-all duration-300 flex-shrink-0" />
            <span>Start a project</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 sm:p-2.5 rounded-full border transition-colors cursor-pointer flex-shrink-0 ${
              isPastHero
                ? 'bg-neutral-100 border-neutral-300 text-neutral-900 hover:bg-neutral-200'
                : 'bg-black border-white/20 text-white hover:bg-white/10'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-x-4 top-20 z-40 p-6 rounded-3xl backdrop-blur-xl md:hidden flex flex-col space-y-4 shadow-2xl border ${
              isPastHero
                ? 'bg-white/95 border-black/10 text-neutral-900'
                : 'bg-[#0e0e0e]/95 border-white/15 text-white'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b text-xs font-mono ${
                isPastHero ? 'border-black/10 text-neutral-500' : 'border-white/10 text-white/50'
              }`}
            >
              <span className={`flex items-center gap-2 ${isPastHero ? 'text-neutral-900' : 'text-white/70'}`}>
                <span>HUTCHFORGE STUDIO</span>
              </span>
              <span>INDEX</span>
            </div>

            <div className="flex flex-col space-y-1 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-4 py-3 rounded-xl text-left transition-colors ${
                  isPastHero
                    ? currentRoute === 'home'
                      ? 'text-black bg-black/5 font-semibold'
                      : 'text-neutral-800 hover:text-black hover:bg-black/5'
                    : currentRoute === 'home'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`px-4 py-3 rounded-xl text-left transition-colors ${
                  isPastHero
                    ? currentRoute === 'about'
                      ? 'text-black bg-black/5 font-semibold'
                      : 'text-neutral-800 hover:text-black hover:bg-black/5'
                    : currentRoute === 'about'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('work')}
                className={`px-4 py-3 rounded-xl text-left transition-colors ${
                  isPastHero
                    ? currentRoute === 'work'
                      ? 'text-black bg-black/5 font-semibold'
                      : 'text-neutral-800 hover:text-black hover:bg-black/5'
                    : currentRoute === 'work'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Work
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className={`px-4 py-3 rounded-xl text-left transition-colors ${
                  isPastHero
                    ? currentRoute === 'services'
                      ? 'text-black bg-black/5 font-semibold'
                      : 'text-neutral-800 hover:text-black hover:bg-black/5'
                    : currentRoute === 'services'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className={`px-4 py-3 rounded-xl text-left transition-colors ${
                  isPastHero
                    ? currentRoute === 'faq'
                      ? 'text-black bg-black/5 font-semibold'
                      : 'text-neutral-800 hover:text-black hover:bg-black/5'
                    : currentRoute === 'faq'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`px-4 py-3 rounded-xl text-left transition-colors ${
                  isPastHero
                    ? currentRoute === 'contact'
                      ? 'text-black bg-black/5 font-semibold'
                      : 'text-neutral-800 hover:text-black hover:bg-black/5'
                    : currentRoute === 'contact'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

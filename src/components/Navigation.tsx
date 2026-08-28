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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger logo emergence once user starts scrolling down
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Floating Glass/Black Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 md:px-14 py-4 sm:py-6 pointer-events-none transition-all duration-300">
        
        {/* Left: Studio Brand & Logo always visible in top left (doubled in size) */}
        <div className="pointer-events-auto min-w-[160px]">
          <BrandLogo onClick={() => handleNavClick('home')} size="large" />
        </div>

        {/* Center: Aesthetic Minimalist Navigation Capsule with extended length */}
        <nav
          aria-label="Main Navigation"
          className="pointer-events-auto hidden md:flex items-center p-2 rounded-full bg-[#0a0a0a]/85 backdrop-blur-xl border border-white/[0.1] shadow-[0_12px_36px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all min-w-[340px] justify-center"
        >
          <div className="flex items-center gap-2 w-full justify-around px-1">
            <button
              onClick={() => handleNavClick('about')}
              className={`relative flex-1 text-center px-6 py-2.5 rounded-full text-xs tracking-tight transition-all duration-200 cursor-pointer ${
                currentRoute === 'about'
                  ? 'text-white bg-white/[0.12] font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('work')}
              className={`relative flex-1 text-center px-6 py-2.5 rounded-full text-xs tracking-tight transition-all duration-200 cursor-pointer ${
                currentRoute === 'work'
                  ? 'text-white bg-white/[0.12] font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              Work
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`relative flex-1 text-center px-6 py-2.5 rounded-full text-xs tracking-tight transition-all duration-200 cursor-pointer ${
                currentRoute === 'services'
                  ? 'text-white bg-white/[0.12] font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              Services
            </button>
          </div>
        </nav>

        {/* Right: Black Color Pill Button "✦ Start a project" with Deep Blue #1368e6 Hover */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => handleNavClick('contact')}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#000000] hover:bg-[#1368e6] border border-white/20 hover:border-[#1368e6] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_28px_rgba(19,104,230,0.6)] cursor-pointer active:scale-95 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1368e6] group-hover:text-white group-hover:rotate-12 transition-all duration-300" />
            <span>Start a project</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-black border border-white/20 text-white hover:bg-white/10 cursor-pointer"
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
            className="fixed inset-x-4 top-20 z-40 p-6 rounded-3xl bg-[#0e0e0e]/95 backdrop-blur-xl md:hidden flex flex-col space-y-4 border border-white/15 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-white/50">
              <span className="flex items-center gap-2 text-white/70">
                <span>HUTCHFORGE STUDIO</span>
              </span>
              <span>INDEX</span>
            </div>

            <div className="flex flex-col space-y-1 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className="px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('work')}
                className="px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5"
              >
                Work
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5"
              >
                FAQ
              </button>
            </div>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#000000] hover:bg-[#1368e6] border border-white/30 hover:border-[#1368e6] text-white font-semibold text-xs mt-2 transition-all duration-300 shadow-md group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1368e6] group-hover:text-white transition-colors" />
              <span>Start a project</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

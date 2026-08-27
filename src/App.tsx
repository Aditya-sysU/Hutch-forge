import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { LegalPage } from './pages/LegalPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');

  // Sync route with URL hash for browser history & sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = [
        'home',
        'work',
        'services',
        'about',
        'faq',
        'contact',
        'privacy',
        'terms',
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    window.location.hash = route === 'home' ? '' : `#${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between selection:bg-[#0055FF] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Floating Capsule Header / Navigation */}
      <Navigation
        currentRoute={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Main Page View with Smooth Page Transitions */}
      <main className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full flex-1"
          >
            {currentRoute === 'home' && (
              <HomePage onNavigate={navigateTo} />
            )}
            {currentRoute === 'work' && (
              <WorkPage onNavigate={navigateTo} />
            )}
            {currentRoute === 'services' && (
              <ServicesPage onNavigate={navigateTo} />
            )}
            {currentRoute === 'about' && (
              <AboutPage onNavigate={navigateTo} />
            )}
            {currentRoute === 'faq' && (
              <FAQPage onNavigate={navigateTo} />
            )}
            {currentRoute === 'contact' && (
              <ContactPage onNavigate={navigateTo} />
            )}
            {currentRoute === 'submissions' && (
              <SubmissionsPage onNavigate={navigateTo} />
            )}
            {currentRoute === 'privacy' && (
              <LegalPage type="privacy" onNavigate={navigateTo} />
            )}
            {currentRoute === 'terms' && (
              <LegalPage type="terms" onNavigate={navigateTo} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer in natural document flow */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

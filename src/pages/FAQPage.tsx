import React, { useState } from 'react';
import { PageRoute } from '../types';
import { FAQS } from '../data/faq';
import { motion } from 'motion/react';
import { Plus, Minus, Search, ArrowUpRight, Sparkles } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function FAQPage({ onNavigate }: FAQPageProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'General', 'Process', 'Development', 'Engagement'];

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#050505] min-h-screen text-[#F5F5F5]">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-white/10 pb-12 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0055FF]/10 border border-[#0055FF]/20 text-[11px] font-mono text-[#93c5fd]">
            <Sparkles className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>ENGAGEMENT & WORKFLOW PROTOCOLS</span>
          </div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl leading-relaxed font-light">
            Everything you need to know about our capabilities, collaboration methods, development standards, and project lifecycle.
          </p>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0055FF] text-white font-semibold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0055FF] rounded-full transition-colors"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-sm font-mono text-white/40">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div key={faq.id} className="py-6">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-start justify-between text-left gap-4 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-white/30 shrink-0 pt-0.5">
                        0{index + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono text-[#0055FF] uppercase tracking-wider block mb-1 font-bold">
                          {faq.category}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                          {faq.question}
                        </h2>
                      </div>
                    </div>

                    <span className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 shrink-0 mt-1">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-3 pl-8 text-xs sm:text-sm text-white/70 leading-relaxed max-w-3xl pr-4 font-light"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111111] to-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-[26px] font-extrabold tracking-tight text-white">
              Still have a specific question?
            </h3>
            <p className="text-xs font-mono text-white/50">
              Contact our team directly or book an introductory call.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="btn-pill-primary shrink-0 text-sm py-3 px-6 cursor-pointer"
          >
            <span>Start a Project Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

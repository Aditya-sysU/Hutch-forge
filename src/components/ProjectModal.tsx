import React, { useEffect } from 'react';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, CheckCircle2, Sparkles, Layers, Zap } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl bg-[#0e0e0e] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[90vh] flex flex-col rounded-3xl"
        >
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse" />
              <span className="text-xs font-mono tracking-wider text-white/60 uppercase">
                CASE STUDY // {project.id.toUpperCase()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              aria-label="Close case study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Header / Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#93c5fd] font-semibold uppercase">
                  <span>{project.category}</span>
                  <span className="text-white/20">•</span>
                  <span>{project.year}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                  {project.title}
                </h2>
                <p className="text-xs font-mono text-white/50">
                  Client Partner: {project.client}
                </p>
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary shrink-0 text-xs py-2.5 px-5 cursor-pointer"
                >
                  <span>Visit Live Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Visual Frame */}
            <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-black/40">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#161616] border-b border-white/10 text-xs font-mono text-white/40">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="truncate max-w-xs text-white/60">
                  {project.liveUrl || `https://${project.id}.hutchforge.studio`}
                </div>
                <div className="text-[10px] text-emerald-400">95+ LIGHTHOUSE</div>
              </div>
              <img
                src={project.image}
                alt={project.imageAlt}
                className="w-full h-auto max-h-[440px] object-cover object-top"
                loading="lazy"
              />
            </div>

            {/* Overview & Deliverables Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
              <div className="md:col-span-7 space-y-4">
                <div className="text-xs font-mono text-[#0055FF] font-semibold uppercase">
                  // STRATEGIC OVERVIEW & ARCHITECTURE
                </div>
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  {project.overview}
                </p>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="pt-4 space-y-2">
                  <div className="text-xs font-mono text-white/40 uppercase">
                    // PRODUCTION TECH STACK
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-mono bg-white/5 border border-white/10 text-white/80 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 space-y-5">
                <div className="text-xs font-mono text-[#0055FF] font-semibold uppercase">
                  // DELIVERED SCOPE & MILESTONES
                </div>
                <div className="space-y-2">
                  {project.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-white/80 p-2.5 bg-white/[0.02] border border-white/5 rounded-xl"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0055FF] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Palette */}
                <div className="pt-3 space-y-2">
                  <div className="text-xs font-mono text-white/40 uppercase">
                    // COLOR TOKENS
                  </div>
                  <div className="flex items-center gap-2">
                    {project.palette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div
                          className="w-7 h-7 rounded-lg border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono text-white/50">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#121212] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
            <span>HUTCHFORGE PRODUCTION CASE STUDY</span>
            <button
              onClick={onClose}
              className="text-white hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              CLOSE [ESC]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

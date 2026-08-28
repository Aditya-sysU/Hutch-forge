import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (route: PageRoute) => void;
}

export function LegalPage({ type, onNavigate }: LegalPageProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(type);

  return (
    <div className="w-full pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#050505] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-white/10 pb-12">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#002B5B]" />
            <span>// GOVERNANCE & LEGAL COMPLIANCE</span>
          </div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#F5F5F5] font-sans">
            {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Engagement'}
          </h1>
          <p className="text-xs font-mono text-white/40 mt-4">
            EFFECTIVE DATE: AUGUST 2026 • VERSION 1.4 // HUTCHFORGE STUDIO
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer rounded-[2px] ${
              activeTab === 'privacy'
                ? 'bg-[#002B5B] text-white font-semibold border border-[#003d80]'
                : 'bg-[#111111] border border-[#222222] text-white/60 hover:text-white hover:border-[#002B5B]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer rounded-[2px] ${
              activeTab === 'terms'
                ? 'bg-[#002B5B] text-white font-semibold border border-[#003d80]'
                : 'bg-[#111111] border border-[#222222] text-white/60 hover:text-white hover:border-[#002B5B]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Engagement</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'privacy' ? (
          <div className="space-y-10 text-sm text-[#E4E3E0] leading-relaxed font-sans font-light">
            <div className="p-4 bg-[#111111] border border-[#222222] font-mono text-xs text-white/60 rounded-[2px]">
              <span className="text-[#60a5fa] font-bold">[PLACEHOLDER NOTICE]</span>: This Privacy Policy outlines data handling practices for Hutchforge. Business registration details: <code className="text-white font-mono">[Hutchforge Studio Ltd / Reg No: HF-XXXXXX-UK]</code>.
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                1. Information We Collect
              </h2>
              <p>
                Hutchforge collects information strictly when you deliberately provide it through our project intake form, email correspondence, or contract engagement. This includes your name, corporate email address, telephone number, organization name, current website URL, and project brief details.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                2. Purpose and Legal Basis for Processing
              </h2>
              <p>
                We process your data exclusively to evaluate potential design and engineering engagements, formulate technical proposals, maintain project communications, and synchronize client briefs with our internal CRM and secure spreadsheet pipelines.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                3. Third-Party Integrations & Data Storage
              </h2>
              <p>
                Form submissions are routed through our secure backend server and stored on encrypted databases and Google Workspace infrastructure. We never sell, monetize, or disclose your contact or project data to third-party advertisers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                4. Your Rights Under GDPR & CCPA
              </h2>
              <p>
                You retain the right to request access to, correction of, or permanent deletion of any personal data maintained by Hutchforge. To execute these rights, submit a written request to <a href="mailto:privacy@hutchforge.studio" className="text-[#60a5fa] underline">privacy@hutchforge.studio</a>.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-10 text-sm text-[#E4E3E0] leading-relaxed font-sans font-light">
            <div className="p-4 bg-[#111111] border border-[#222222] font-mono text-xs text-white/60 rounded-[2px]">
              <span className="text-[#60a5fa] font-bold">[PLACEHOLDER NOTICE]</span>: These Terms govern client commissioning, intellectual property handoff, and milestone delivery protocols for Hutchforge.
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                1. Scope of Engagement
              </h2>
              <p>
                All design, UI/UX, and website development services are provided in accordance with the specific Statement of Work (SOW) mutually signed prior to project kickoff. Modifications to project scope require mutual written agreement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                2. Intellectual Property & Code Ownership
              </h2>
              <p>
                Upon receipt of full and final payment for all agreed milestones, all bespoke visual design assets, custom typography configurations, and proprietary frontend codebases are assigned entirely to the client with full commercial rights.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                3. Production Standards & Quality Assurance
              </h2>
              <p>
                Hutchforge adheres to modern web standards including semantic TypeScript, responsive breakpoints, accessibility compliance (WCAG AA), and performance optimization. Projects include a standard 30-day post-deployment warranty period.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-tight">
                4. Confidentiality & Non-Disclosure
              </h2>
              <p>
                We treat all client unreleased products, architectural plans, and corporate strategies with strict confidentiality. Non-disclosure agreements (NDAs) can be executed upon request prior to project scoping.
              </p>
            </section>
          </div>
        )}

        {/* Back Link */}
        <div className="border-t border-white/10 pt-12 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Studio Home
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="text-xs font-mono uppercase tracking-wider text-[#60a5fa] hover:text-white flex items-center gap-1 cursor-pointer"
          >
            Start a Project <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

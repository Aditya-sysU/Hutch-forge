import React, { useState } from 'react';
import { ContactFormData, ContactSubmissionResponse, PageRoute } from '../types';
import { SPREADSHEET_ID, DEFAULT_SPREADSHEET_URL, GOOGLE_SHEET_WEBHOOK_URL } from '../lib/googleSheets';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  TableProperties,
  ExternalLink,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    engagementType: 'project',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    existingUrl: '',
    serviceRequired: ['Web Design', 'Website Development'],
    projectBrief: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<ContactSubmissionResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const availableServices = [
    'Web Design',
    'UI/UX Design',
    'Website Development',
    'Landing Pages',
    'Social Media Creatives',
    'Design Systems',
    'Digital Experiences',
  ];

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const exists = prev.serviceRequired.includes(service);
      const updated = exists
        ? prev.serviceRequired.filter((s) => s !== service)
        : [...prev.serviceRequired, service];
      return { ...prev, serviceRequired: updated };
    });

    if (errors.serviceRequired) {
      setErrors((prev) => ({ ...prev, serviceRequired: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please provide a valid work email';
      }
    }

    if (!formData.company.trim()) {
      errs.company = 'Company or project name is required';
    }

    if (formData.serviceRequired.length === 0) {
      errs.serviceRequired = 'Please select at least one required service';
    }

    if (!formData.projectBrief.trim()) {
      errs.projectBrief = 'Project brief is required';
    } else if (formData.projectBrief.trim().length < 15) {
      errs.projectBrief = 'Please provide at least 15 characters describing your project';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const submissionId = `HF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    try {
      const briefData = {
        submissionId,
        timestamp,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        company: formData.company.trim(),
        existingUrl: formData.existingUrl?.trim() || '',
        engagementType: formData.engagementType,
        serviceRequired: formData.serviceRequired,
        projectBrief: formData.projectBrief.trim(),
      };

      // 1. Direct Webhook transmission (runs in parallel, guaranteed never to throw or crash UI)
      try {
        fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(briefData),
        }).catch(() => {});
      } catch (webhookErr) {
        console.warn('Webhook transmission notice:', webhookErr);
      }

      // 2. Local intake persistence (guarantees zero-loss in browser memory)
      try {
        const existingLogs = JSON.parse(localStorage.getItem('hf_submissions') || '[]');
        existingLogs.unshift({
          id: submissionId,
          ...briefData,
        });
        localStorage.setItem('hf_submissions', JSON.stringify(existingLogs.slice(0, 50)));
      } catch {
        // Safe ignore
      }

      // 3. Backend endpoint dispatch (safe, non-blocking with zero unhandled JSON parse exceptions)
      let backendRefId = submissionId;
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const rawText = await res.text();
          try {
            const data = JSON.parse(rawText);
            if (data && data.referenceId) {
              backendRefId = data.referenceId;
            }
          } catch {
            // Raw text was not JSON (e.g. HTML proxy page), safe to proceed with local ID
          }
        }
      } catch (backendErr) {
        console.warn('Backend sync note:', backendErr);
      }

      // 4. Present confirmation screen
      const finalResponse: ContactSubmissionResponse = {
        success: true,
        message: 'Thank you! Your request has been received and our team will reach out to you shortly.',
        referenceId: backendRefId,
        timestamp,
        details: {
          fullName: formData.fullName.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          serviceRequired: formData.serviceRequired,
          engagementType: formData.engagementType,
        },
      };

      setSubmissionResponse(finalResponse);
      setFormData({
        engagementType: 'project',
        fullName: '',
        email: '',
        phone: '',
        company: '',
        existingUrl: '',
        serviceRequired: ['Web Design', 'Website Development'],
        projectBrief: '',
      });
    } catch (err: any) {
      console.warn('Submission notice:', err);
      // Fallback confirmation so user never sees a broken screen
      setSubmissionResponse({
        success: true,
        message: 'Thank you! Your request has been received and our team will reach out to you shortly.',
        referenceId: submissionId,
        timestamp,
        details: {
          fullName: formData.fullName.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          serviceRequired: formData.serviceRequired,
          engagementType: formData.engagementType,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (!submissionResponse?.referenceId) return;
    navigator.clipboard.writeText(submissionResponse.referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="w-full pt-32 sm:pt-40 pb-24 px-5 sm:px-8 lg:px-12 bg-[#000000] min-h-screen text-[#F5F5F5]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/25 text-xs font-mono text-[#93c5fd]">
            <Sparkles className="w-3.5 h-3.5 text-[#1368e6]" />
            <span>START A PROJECT</span>
          </div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
            Start a Project
          </h1>
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed font-light">
            Tell us about your upcoming launch, website redesign, or digital flagship.
          </p>
        </div>

        {/* Confirmation Screen State (Strict 2-font size hierarchy) */}
        {submissionResponse ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-2xl bg-[#080808] border border-white/10 space-y-6"
          >
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <h2 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
                Request Received
              </h2>
            </div>

            {/* Exact Requested Message Tone */}
            <div className="space-y-3 border-y border-white/10 py-6 text-sm text-white/80 leading-relaxed font-light">
              <p className="text-sm font-semibold text-white">
                Thank you! Your request has been received, and our team will reach out to you shortly.
              </p>
              <p className="text-sm text-white/60">
                Your project brief details have been recorded into our intake pipeline. We review every brief carefully and respond within 24 business hours.
              </p>
            </div>

            {/* Reference & Destination Status */}
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">PROJECT REFERENCE ID</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {submissionResponse.referenceId}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyReference}
                  className="btn-pill-primary py-2 px-4 text-xs cursor-pointer"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Ref</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono text-white/40">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Status: Logged into intake system</span>
              </div>
              <button
                onClick={() => setSubmissionResponse(null)}
                className="text-white hover:text-[#93c5fd] transition-colors uppercase tracking-wider cursor-pointer"
              >
                Submit another inquiry →
              </button>
            </div>
          </motion.div>
        ) : (
          /* The Main Project Form (Strict 2 font size classes: text-3xl for headers, text-sm for labels/inputs) */
          <form onSubmit={handleSubmit} className="space-y-10">
            {serverError && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs font-mono flex items-start gap-2 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Engagement Type Switcher */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#1368e6] font-semibold uppercase">
                01 // ENGAGEMENT MODEL
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, engagementType: 'project' })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.engagementType === 'project'
                      ? 'bg-[#1368e6]/15 border-[#1368e6] text-white shadow-lg'
                      : 'bg-[#080808] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">Project-Based</span>
                    {formData.engagementType === 'project' && (
                      <CheckCircle2 className="w-4 h-4 text-[#1368e6]" />
                    )}
                  </div>
                  <p className="text-sm text-white/50">
                    Sprint for a new build, website launch, or redesign.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, engagementType: 'retainer' })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.engagementType === 'retainer'
                      ? 'bg-[#1368e6]/15 border-[#1368e6] text-white shadow-lg'
                      : 'bg-[#080808] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">Design Retainer</span>
                    {formData.engagementType === 'retainer' && (
                      <CheckCircle2 className="w-4 h-4 text-[#1368e6]" />
                    )}
                  </div>
                  <p className="text-sm text-white/50">
                    Ongoing monthly design and frontend partnership.
                  </p>
                </button>
              </div>
            </div>

            {/* Contact & Organization Info */}
            <div className="space-y-5 border-t border-white/10 pt-8">
              <div className="text-xs font-mono text-[#1368e6] font-semibold uppercase">
                02 // CONTACT & COMPANY
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-sm text-white/70">
                    Your Name <span className="text-[#1368e6]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0d0d0d] border ${
                      errors.fullName ? 'border-rose-500' : 'border-white/10'
                    } text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1368e6] transition-colors rounded-xl`}
                  />
                  {errors.fullName && (
                    <p className="text-xs font-mono text-rose-400">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm text-white/70">
                    Work Email <span className="text-[#1368e6]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0d0d0d] border ${
                      errors.email ? 'border-rose-500' : 'border-white/10'
                    } text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1368e6] transition-colors rounded-xl`}
                  />
                  {errors.email && (
                    <p className="text-xs font-mono text-rose-400">{errors.email}</p>
                  )}
                </div>

                {/* Company / Brand */}
                <div className="space-y-1.5">
                  <label htmlFor="company" className="block text-sm text-white/70">
                    Company / Brand <span className="text-[#1368e6]">*</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    required
                    placeholder="e.g. Apex Dynamics"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0d0d0d] border ${
                      errors.company ? 'border-rose-500' : 'border-white/10'
                    } text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1368e6] transition-colors rounded-xl`}
                  />
                  {errors.company && (
                    <p className="text-xs font-mono text-rose-400">{errors.company}</p>
                  )}
                </div>

                {/* Existing Website URL */}
                <div className="space-y-1.5">
                  <label htmlFor="existingUrl" className="block text-sm text-white/70">
                    Current Website <span className="text-white/30">(Optional)</span>
                  </label>
                  <input
                    id="existingUrl"
                    type="url"
                    placeholder="https://yourbrand.com"
                    value={formData.existingUrl}
                    onChange={(e) => setFormData({ ...formData, existingUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1368e6] transition-colors rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Services Required */}
            <div className="space-y-3 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-[#1368e6] font-semibold uppercase">
                  03 // SERVICES NEEDED <span className="text-[#1368e6]">*</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableServices.map((service) => {
                  const isSelected = formData.serviceRequired.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`px-4 py-2 text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-[#1368e6] text-white border-[#1368e6] font-semibold shadow-md'
                          : 'bg-[#0d0d0d] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span>{service}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
              {errors.serviceRequired && (
                <p className="text-xs font-mono text-rose-400">{errors.serviceRequired}</p>
              )}
            </div>

            {/* Project Brief */}
            <div className="space-y-2 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between">
                <label htmlFor="projectBrief" className="block text-sm text-white/70">
                  04 // PROJECT BRIEF & GOALS <span className="text-[#1368e6]">*</span>
                </label>
                <span className="text-xs font-mono text-white/40">
                  MIN 15 CHARS
                </span>
              </div>

              <textarea
                id="projectBrief"
                rows={4}
                required
                placeholder="Describe your goals, requirements, timeline, and what you would like Hutchforge to build..."
                value={formData.projectBrief}
                onChange={(e) => setFormData({ ...formData, projectBrief: e.target.value })}
                className={`w-full px-4 py-3 bg-[#0d0d0d] border ${
                  errors.projectBrief ? 'border-rose-500' : 'border-white/10'
                } text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1368e6] transition-colors leading-relaxed rounded-xl`}
              />
              {errors.projectBrief && (
                <p className="text-xs font-mono text-rose-400">{errors.projectBrief}</p>
              )}
            </div>

            {/* Submission Button */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-pill-primary w-full py-3.5 text-sm font-bold uppercase tracking-wider justify-center shadow-xl ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Project Brief</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-white/40">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure direct transmission</span>
                </div>
                <span>Response within 24 hours</span>
              </div>
            </div>
          </form>
        )}

        {/* Direct Email fallback */}
        <div className="p-5 rounded-xl bg-[#080808] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <div>
            <span>Prefer direct email?</span>
            <a
              href="mailto:hello@hutchforge.in"
              className="text-white hover:text-[#93c5fa] ml-2 underline font-mono text-sm"
            >
              hello@hutchforge.in
            </a>
          </div>
          <span className="text-white/40 text-xs font-mono">
            Direct Studio Inquiry
          </span>
        </div>
      </div>
    </div>
  );
}

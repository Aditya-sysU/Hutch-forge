import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Sparkles, RefreshCw, Download, ExternalLink, CheckCircle2, Search, TableProperties } from 'lucide-react';

interface Submission {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  existingUrl?: string;
  engagementType: string;
  budgetRange?: string;
  serviceRequired: string[];
  projectBrief: string;
  sheetSynced: boolean;
}

interface SubmissionsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function SubmissionsPage({ onNavigate }: SubmissionsPageProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const localLogs: Submission[] = JSON.parse(localStorage.getItem('hf_submissions') || '[]');
      
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const rawText = await res.text();
        try {
          const data = JSON.parse(rawText);
          const serverSubs: Submission[] = data.submissions || [];
          // Merge unique by id
          const combined = [...serverSubs];
          for (const item of localLogs) {
            if (!combined.some((c) => c.id === item.id)) {
              combined.push(item);
            }
          }
          setSubmissions(combined);
          setSheetUrl(data.sheetUrl || '');
        } catch {
          setSubmissions(localLogs);
        }
      } else {
        setSubmissions(localLogs);
      }
    } catch (err) {
      console.warn('Submissions fetch notice:', err);
      try {
        const localLogs = JSON.parse(localStorage.getItem('hf_submissions') || '[]');
        setSubmissions(localLogs);
      } catch {
        setSubmissions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const downloadCSV = () => {
    if (submissions.length === 0) return;

    const headers = [
      'Submission ID',
      'Date & Time',
      'Full Name',
      'Email',
      'Company',
      'Current Website',
      'Engagement Type',
      'Budget',
      'Services',
      'Project Brief',
      'Sheet Synced',
    ];

    const rows = submissions.map((s) => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.fullName,
      s.email,
      s.company,
      s.existingUrl || 'N/A',
      s.engagementType,
      s.budgetRange,
      s.serviceRequired.join('; '),
      `"${(s.projectBrief || '').replace(/"/g, '""')}"`,
      s.sheetSynced ? 'YES' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hutchforge_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = submissions.filter((s) => {
    const q = filter.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.company.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.projectBrief.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full pt-32 sm:pt-40 pb-24 px-5 sm:px-8 lg:px-12 bg-[#000000] min-h-screen text-[#F5F5F5]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1368e6]/10 border border-[#1368e6]/25 text-xs font-mono text-[#93c5fd]">
              <Sparkles className="w-3.5 h-3.5 text-[#1368e6]" />
              <span>INTAKE PIPELINE</span>
            </div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-white font-sans">
              Recorded Submissions
            </h1>
            <p className="text-sm text-white/70 max-w-2xl font-light">
              All project inquiries recorded via Hutchforge intake, direct Google Sheet synchronization, and downloadable CSV backup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-secondary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
              >
                <TableProperties className="w-4 h-4 text-emerald-400" />
                <span>Open Google Sheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={downloadCSV}
              disabled={submissions.length === 0}
              className="btn-pill-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchSubmissions}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by client name, email, company, or reference ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="py-20 text-center text-sm text-white/40 font-mono">
            Loading intake records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3 rounded-2xl bg-[#080808] border border-white/10 p-8">
            <h2 className="text-[26px] font-extrabold text-white font-sans">
              No Submissions Found
            </h2>
            <p className="text-sm text-white/60">
              Submit a brief on the Contact page to see your real-time entry recorded here and synced into Google Sheets.
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('contact')}
                className="btn-pill-primary text-xs py-2.5 px-5 cursor-pointer"
              >
                Go to Start a Project
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#1368e6]/40 transition-all duration-300 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#1368e6] bg-[#1368e6]/10 border border-[#1368e6]/20 px-2.5 py-1 rounded-lg">
                      {item.id}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {item.fullName}
                    </span>
                    <span className="text-sm text-white/50">
                      ({item.company})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-white/40">
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recorded</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-white/40 uppercase">Email</div>
                    <div className="text-sm text-white font-mono">{item.email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-white/40 uppercase">Engagement Model</div>
                    <div className="text-sm text-white capitalize">
                      {item.engagementType === 'retainer' ? 'Design Retainer' : 'Project Build'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-white/40 uppercase">Website</div>
                    <div className="text-sm text-white/70 truncate">
                      {item.existingUrl || 'None provided'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-xs font-mono text-white/40 uppercase">Services Needed</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.serviceRequired.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-xs font-mono text-white/40 uppercase">Project Brief</div>
                  <p className="text-sm text-white/80 bg-white/[0.02] border border-white/5 p-4 rounded-xl font-light leading-relaxed whitespace-pre-wrap">
                    {item.projectBrief}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

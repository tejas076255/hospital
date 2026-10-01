'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { Download, FileText } from 'lucide-react';

const REPORTS = [
  { name: 'Monthly Clinical Inpatient Census', date: 'October 2026', size: '2.4 MB', type: 'Clinical Quality' },
  { name: 'Quarterly Operating Room Utilization & Turnaround', date: 'Q3 2026', size: '4.1 MB', type: 'Surgical Operations' },
  { name: 'Hospital-Acquired Infection (HAI) Zero-Target Audit', date: 'September 2026', size: '1.2 MB', type: 'Infection Control' },
  { name: 'Revenue Cycle Management & Accounts Aging', date: 'September 2026', size: '3.8 MB', type: 'Financial Analytics' },
  { name: 'Pharmacy Antimicrobial Stewardship Report', date: 'August 2026', size: '1.9 MB', type: 'Pharmacology' },
];

export default function AdminReportsPage() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Healthcare & Financial Reports
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Clinical outcomes, JCI compliance audits, surgical theater utilization, and revenue exports.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#EAEAEA] overflow-hidden">
          <div className="divide-y divide-[#EAEAEA]">
            {REPORTS.map((r, i) => (
              <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#F8F8F8] text-[#111111] border border-[#EAEAEA]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-[#111111]">{r.name}</h4>
                    <p className="text-[11px] text-[#6B7280]">{r.type} • {r.date} • {r.size}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading ${r.name}...`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#111111] bg-white hover:bg-zinc-50 border border-[#EAEAEA] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

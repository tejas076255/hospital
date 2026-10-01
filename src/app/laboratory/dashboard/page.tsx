'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Syringe } from 'lucide-react';

export default function LaboratoryDashboardPage() {
  const { labRequests, updateLabStatus } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Biochemistry & Pathology
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Laboratory Specimen Workstation
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Specimen accessioning, automated hematology counters, and pathologist sign-offs.
            </p>
          </div>

          <Link
            href="/laboratory/tests"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
          >
            <Syringe className="w-4 h-4" />
            View All Test Batches
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Requested Tests</span>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {labRequests.filter((l) => l.status === 'requested').length}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Awaiting phlebotomy draw</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Processing on Analyzers</span>
            <p className="text-2xl font-black text-zinc-950 mt-1">
              {labRequests.filter((l) => l.status === 'processing' || l.status === 'sample_collected').length}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Spectrometry in progress</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Completed Today</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {labRequests.filter((l) => l.status === 'completed').length}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Verified & sent to EHR</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-zinc-950">Active Diagnostic Queue</h3>
          <div className="space-y-3">
            {labRequests.map((lab) => (
              <div
                key={lab.id}
                className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-zinc-950">{lab.requestNumber}</span>
                    <h4 className="font-bold text-xs text-zinc-950">{lab.testName}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Patient: {lab.patientName} ({lab.patientMrn}) • Ordered by {lab.doctorName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase bg-zinc-100 border border-zinc-200 text-zinc-800">
                    {lab.status.replace('_', ' ')}
                  </span>
                  {lab.status !== 'completed' && (
                    <button
                      onClick={() => {
                        updateLabStatus(
                          lab.id,
                          'completed',
                          [{ name: 'Assay Value', result: '112', unit: 'mg/dL', referenceRange: '70-120', isAbnormal: false }],
                          'Certified normal'
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                    >
                      Sign Off Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

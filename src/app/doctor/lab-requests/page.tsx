'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function DoctorLabRequestsPage() {
  const { labRequests } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Diagnostics Order Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Ordered Pathology & Diagnostic Assays
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review turnaround times and pathology interpretations for patient blood, urine, and cardiac biomarkers.
          </p>
        </div>

        <div className="space-y-4">
          {labRequests.map((lab) => (
            <div
              key={lab.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-mono font-bold text-zinc-950">{lab.requestNumber}</span>
                <h3 className="font-bold text-sm text-zinc-950 mt-0.5">{lab.testName}</h3>
                <p className="text-xs text-zinc-500">Patient: {lab.patientName} ({lab.patientMrn})</p>
                <p className="text-[11px] text-zinc-400 mt-1">Requested: {formatDate(lab.requestedDate)}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-zinc-100 border border-zinc-200 text-zinc-800 w-fit">
                {lab.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

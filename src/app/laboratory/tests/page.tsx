'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function LaboratoryTestsPage() {
  const { labRequests } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Diagnostic Orders
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Pathology Test Requests & Biomarkers
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Access master order queues, barcode specimens, and numerical biomarker reports.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-zinc-200 shadow-xs divide-y divide-zinc-100 overflow-hidden">
          {labRequests.map((l) => (
            <div key={l.id} className="p-5 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-zinc-950">{l.requestNumber}</span>
                <h3 className="font-bold text-sm text-zinc-950 mt-0.5">{l.testName}</h3>
                <p className="text-xs text-zinc-500">
                  Patient: {l.patientName} ({l.patientMrn}) • Category: {l.testCategory}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">Ordered on: {formatDate(l.requestedDate)}</p>
              </div>

              <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase bg-zinc-100 border border-zinc-200 text-zinc-800">
                {l.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

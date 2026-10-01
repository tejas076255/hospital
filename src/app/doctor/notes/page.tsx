'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function DoctorNotesPage() {
  const { medicalRecords } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Clinical Documentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Doctor Progress Notes & Summaries
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            SOAP documentation, clinical findings, and treatment plans signed by attending physicians.
          </p>
        </div>

        <div className="space-y-4">
          {medicalRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-950">
                  {rec.patientName} ({rec.patientMrn})
                </h3>
                <span className="text-xs text-zinc-400 font-medium">{formatDate(rec.visitDate)}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-900">Diagnosis: {rec.diagnosis}</p>
              <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                {rec.clinicalNotes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function DoctorPrescriptionsPage() {
  const { prescriptions } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Pharmacotherapy
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Issued Electronic Prescriptions (e-Rx)
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Audit log of digital pharmaceutical scripts signed from your clinical workstation.
          </p>
        </div>

        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-zinc-950">{rx.prescriptionNumber}</span>
                <span className="text-xs text-zinc-400">Issued: {formatDate(rx.dateIssued)}</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-950">
                Patient: {rx.patientName} ({rx.patientMrn})
              </h3>
              <p className="text-xs text-zinc-500">Diagnosis: {rx.diagnosis}</p>

              <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs">
                {rx.items.map((i) => (
                  <p key={i.id} className="text-zinc-700">
                    • <strong>{i.medicineName}</strong> ({i.dosage}) — {i.frequency} for {i.duration}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { CheckCircle2 } from 'lucide-react';

export default function PharmacyDispensePage() {
  const { prescriptions } = useHospitalStore();
  const [dispensedMap, setDispensedMap] = useState<Record<string, boolean>>({});

  const handleDispense = (id: string) => {
    setDispensedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Outpatient Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Prescription Dispensing & Barcode Verification
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Verify contraindications, drug-drug interactions, patient allergies, and print prescription label instructions.
          </p>
        </div>

        <div className="space-y-4">
          {prescriptions.map((rx) => {
            const isDispensed = dispensedMap[rx.id];
            return (
              <div
                key={rx.id}
                className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-zinc-950">{rx.prescriptionNumber}</span>
                    <h4 className="font-bold text-sm text-zinc-950">{rx.patientName}</h4>
                    <span className="font-mono text-xs text-zinc-400">({rx.patientMrn})</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Physician: {rx.doctorName} • Diagnosis: {rx.diagnosis}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    {rx.items.map((i) => (
                      <p key={i.id} className="text-zinc-700">
                        • <strong>{i.medicineName} ({i.dosage})</strong>: {i.frequency} for {i.duration}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  {isDispensed ? (
                    <span className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      Dispensed & Packaged
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDispense(rx.id)}
                      className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                    >
                      Package & Dispense Rx
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}

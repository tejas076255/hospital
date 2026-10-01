'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';

export default function ReceptionistAvailabilityPage() {
  const { doctors } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Real-Time Board
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Doctor Clinic Availability & Room Board
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Live on-duty status, consultation suites, and available walk-in appointment windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Clinic Suite
                </span>
                <span className="font-mono text-xs text-zinc-500">{doc.roomNumber}</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-950">{doc.fullName}</h3>
              <p className="text-xs text-zinc-600 font-medium">{doc.specialization}</p>
              <div className="pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                <p>Days: {doc.availableDays.join(', ')}</p>
                <p className="mt-1">Fee: ${doc.consultationFee}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

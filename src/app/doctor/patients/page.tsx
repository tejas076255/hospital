'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function DoctorPatientsPage() {
  const { patients } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Assigned Cohort
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            My Cardiology Patients
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Roster of active outpatients and inpatients receiving cardiovascular care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((pat) => (
            <div
              key={pat.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-zinc-950">
                  {pat.mrn}
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  {pat.bloodGroup}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-zinc-950">{pat.fullName}</h3>
                <p className="text-xs text-zinc-500">{pat.gender} • DOB: {formatDate(pat.dateOfBirth)}</p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1 text-xs text-zinc-600">
                <p>Phone: <strong className="text-zinc-900">{pat.phone}</strong></p>
                <p>Allergies: <span className="text-rose-600 font-semibold">{pat.allergies.join(', ') || 'None'}</span></p>
                <p>Chronic: {pat.chronicDiseases.join(', ') || 'None'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function ReceptionistCheckInPage() {
  const { appointments, updateAppointmentStatus } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Arrival Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Patient Arrival Triage & Check-in
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Confirm identity, verify copayments, and signal physicians that patient is in the waiting lounge.
          </p>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-zinc-950">{apt.patientName}</h4>
                <p className="text-xs text-zinc-500">
                  MRN: {apt.patientMrn} • Attending: <strong>{apt.doctorName}</strong>
                </p>
                <p className="text-[11px] text-zinc-400">Scheduled: {formatDate(apt.date)} at {apt.time}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase bg-zinc-100 border border-zinc-200 text-zinc-800">
                  {apt.status.replace('_', ' ')}
                </span>
                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'checked_in')}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    Check In Patient
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

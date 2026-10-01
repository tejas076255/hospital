'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';

export default function DoctorAppointmentsPage() {
  const { appointments, currentUser } = useHospitalStore();

  const myApts = appointments.filter(
    (a) => a.doctorName.toLowerCase().includes('jenkins') || a.doctorId === currentUser.id
  );

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Clinical Workflow
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Outpatient & Telemedicine Consultation Queue
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your daily roster of patient consultations, check-ins, and electronic notes.
          </p>
        </div>

        <div className="space-y-4">
          {myApts.map((apt) => (
            <div
              key={apt.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-200 shadow-2xs">
                  {apt.time}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-950">
                      {apt.patientName}
                    </h3>
                    <span className="font-mono text-xs text-zinc-500">({apt.patientMrn})</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Chief Complaint: <strong className="text-zinc-800">{apt.reason}</strong>
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Scheduled: {formatDate(apt.date)} • Mode: {apt.type.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-zinc-100 border border-zinc-200 text-zinc-800">
                  {apt.status.replace('_', ' ')}
                </span>
                <Link
                  href={`/doctor/consultation/${apt.id}`}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                >
                  Start Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

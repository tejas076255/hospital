'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { UserPlus, Calendar } from 'lucide-react';

export default function ReceptionistDashboardPage() {
  const { appointments, updateAppointmentStatus } = useHospitalStore();

  const todayApts = appointments.filter((a) => a.date === '2026-10-02' || a.status !== 'completed');

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Front Desk & Triage
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Receptionist Operations Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Walk-in patient registration, real-time arrival check-in, and doctor room availability board.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/receptionist/registration"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Walk-in Registration
            </Link>
          </div>
        </div>

        {/* Live Arrival Queue */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-900" />
              Arrival Queue & Fast Check-In
            </h3>
            <span className="text-xs font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full">
              {todayApts.length} Today
            </span>
          </div>

          <div className="space-y-3">
            {todayApts.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-zinc-950">{apt.patientName}</h4>
                    <span className="font-mono text-[11px] text-zinc-400">({apt.patientMrn})</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Attending: <strong>{apt.doctorName}</strong> ({apt.departmentName})
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Scheduled: {apt.time} • Fee: ${apt.fee}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase bg-white border border-zinc-200 text-zinc-700">
                    {apt.status.replace('_', ' ')}
                  </span>
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'checked_in')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                    >
                      Check-In Patient
                    </button>
                  )}
                  {apt.status === 'checked_in' && (
                    <span className="text-xs text-zinc-950 font-bold bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">Checked In ✓</span>
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

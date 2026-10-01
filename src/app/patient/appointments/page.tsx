'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Plus, Clock, Stethoscope } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientAppointmentsPage() {
  const { currentUser, appointments, cancelAppointment } = useHospitalStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const userMrn = currentUser.patientMrn || 'MRN-84291';
  const myApts = appointments.filter((a) => a.patientMrn === userMrn || a.patientId === currentUser.id);

  const filtered = myApts.filter((a) => {
    if (filter === 'upcoming') return a.status === 'confirmed' || a.status === 'checked_in';
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Scheduling & Consultations
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              My Appointments
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Review confirmed hospital visits, telemedicine video sessions, or reschedule slots.
            </p>
          </div>

          <Link
            href="/book-appointment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Book New Consultation
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {tab} ({tab === 'all' ? myApts.length : myApts.filter((a) => a.status === tab).length})
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 rounded-2xl bg-white border border-zinc-200">
              No appointments found in this category.
            </div>
          ) : (
            filtered.map((apt) => (
              <div
                key={apt.id}
                className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-zinc-950">
                        {apt.doctorName}
                      </h3>
                      <span className="text-[10px] font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                        {apt.doctorSpecialty}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Reason: <strong className="text-zinc-800">{apt.reason}</strong>
                    </p>
                    <p className="text-xs text-zinc-600 flex items-center gap-1.5 pt-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-zinc-900" />
                      {formatDate(apt.date)} at {apt.time} ({apt.type.replace('_', ' ')})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border capitalize bg-emerald-50 text-emerald-700 border-emerald-200">
                    {apt.status.replace('_', ' ')}
                  </span>
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => cancelAppointment(apt.id, 'Patient requested cancellation')}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

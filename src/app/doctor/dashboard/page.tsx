'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Calendar,
  Syringe,
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const { appointments, labRequests, currentUser } = useHospitalStore();

  const docName = currentUser.fullName.includes('Dr.') ? currentUser.fullName : 'Dr. Sarah Jenkins';

  const myAppointments = appointments.filter((a) => a.doctorName.toLowerCase().includes('jenkins') || a.doctorId === currentUser.id);
  const waitingPatients = myAppointments.filter((a) => a.status === 'checked_in');
  const inProgressApt = myAppointments.find((a) => a.status === 'in_progress');
  const completedCount = myAppointments.filter((a) => a.status === 'completed').length;
  const pendingLabs = labRequests.filter((l) => l.doctorName.toLowerCase().includes('jenkins') && l.status !== 'completed');

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Physician Workstation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              {docName}, MD • Chief of Cardiology
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Today: 8 Consultations Scheduled • Suite 304 • Clinic Hours: 09:00 - 16:30
            </p>
          </div>

          <Link
            href="/doctor/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
          >
            <Calendar className="w-4 h-4" />
            Open Consultation Queue
          </Link>
        </div>

        {/* Quick Clinical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Today&apos;s Appointments</span>
            <p className="text-2xl font-black text-zinc-950 mt-1">{myAppointments.length}</p>
            <p className="text-[11px] text-zinc-500 font-medium mt-1">Cardiology Clinic</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Waiting Room</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{waitingPatients.length}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Checked in & ready</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Completed Today</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">{completedCount}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Notes signed</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Pending Lab Reviews</span>
            <p className="text-2xl font-black text-zinc-950 mt-1">{pendingLabs.length}</p>
            <p className="text-[11px] text-zinc-500 font-medium mt-1">Pathology results</p>
          </div>
        </div>

        {/* Live Active Consultation Banner */}
        {inProgressApt && (
          <div className="p-6 rounded-2xl bg-zinc-950 text-white shadow-sm border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-zinc-200 border border-white/20">
                Active In-Progress Consultation
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">
                Patient: {inProgressApt.patientName} ({inProgressApt.patientMrn})
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Chief Complaint: {inProgressApt.reason}
              </p>
            </div>
            <Link
              href={`/doctor/consultation/${inProgressApt.id}`}
              className="px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs shadow-xs hover:bg-zinc-100 transition-colors w-fit"
            >
              Resume Consultation Room →
            </Link>
          </div>
        )}

        {/* Today's Queue & Waiting Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-950">
                  Today&apos;s Clinical Consultation Queue
                </h3>
                <p className="text-xs text-zinc-500">Live queue with one-click consultation launch</p>
              </div>
              <Link href="/doctor/appointments" className="text-xs font-semibold text-zinc-950 hover:underline">
                View Queue →
              </Link>
            </div>

            <div className="space-y-3">
              {myAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white text-zinc-950 border border-zinc-200 font-bold text-xs flex items-center justify-center shadow-2xs">
                      {apt.time}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-950">
                        {apt.patientName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        {apt.patientMrn} • {apt.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-700">
                      {apt.status.replace('_', ' ')}
                    </span>
                    <Link
                      href={`/doctor/consultation/${apt.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                    >
                      Start Consult
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Pathology Alerts */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-zinc-900" />
              Pathology & Lab Orders
            </h3>
            <p className="text-xs text-zinc-500">Ordered by your clinical service</p>

            <div className="space-y-2">
              {labRequests.slice(0, 3).map((lab) => (
                <div key={lab.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-zinc-950">
                    <span>{lab.testName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 uppercase">{lab.status}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">Patient: {lab.patientName} ({lab.patientMrn})</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

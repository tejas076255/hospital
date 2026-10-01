'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Calendar,
  Clock,
  Pill,
  Syringe,
  CreditCard,
  Activity,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientDashboardPage() {
  const { currentUser, appointments, prescriptions, labRequests, invoices } = useHospitalStore();

  const userMrn = currentUser.patientMrn || 'MRN-84291';

  // Filter for this patient
  const myAppointments = appointments.filter((a) => a.patientMrn === userMrn || a.patientId === currentUser.id);
  const nextAppointment = myAppointments.find((a) => a.status === 'confirmed');
  const myPrescriptions = prescriptions.filter((p) => p.patientMrn === userMrn);
  const myLabs = labRequests.filter((l) => l.patientMrn === userMrn);
  const myInvoices = invoices.filter((i) => i.patientMrn === userMrn);
  const pendingBill = myInvoices.find((i) => i.status === 'pending' || i.status === 'partially_paid');

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 text-white shadow-sm border border-zinc-900 relative overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              Electronic Patient Health Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {currentUser.fullName || 'James Wilson'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Medical Record Number: <strong className="font-mono text-white">{userMrn}</strong> • Primary Care Provider: Dr. Sarah Jenkins
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs shadow-xs hover:bg-zinc-100 transition-colors"
            >
              <Calendar className="w-4 h-4 text-zinc-950" />
              Book Appointment
            </Link>
            <Link
              href="/patient/ai-assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-zinc-300" />
              Ask AI Clinical Assistant
            </Link>
          </div>
        </div>

        {/* Next Appointment Alert & Health Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Next Consultation Card */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-900" />
                Next Scheduled Consultation
              </h3>
              <Link href="/patient/appointments" className="text-xs font-semibold text-zinc-950 hover:underline">
                View all ({myAppointments.length})
              </Link>
            </div>

            {nextAppointment ? (
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-950">
                      {nextAppointment.doctorName}
                    </h4>
                    <p className="text-xs text-zinc-600 font-medium">
                      {nextAppointment.doctorSpecialty}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Reason: {nextAppointment.reason}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <Clock className="w-3.5 h-3.5 text-zinc-900" />
                    {formatDate(nextAppointment.date)} at {nextAppointment.time}
                  </span>
                  <span>•</span>
                  <span>{nextAppointment.type === 'in_person' ? 'Main Hospital Suite 304' : 'Telemedicine HD'}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400 rounded-xl bg-zinc-50 border border-zinc-100">
                No upcoming visits scheduled.
              </div>
            )}
          </div>

          {/* Vitals Summary Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-900" />
              Recent Clinical Vitals
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Blood Pressure</span>
                <p className="text-base font-bold text-zinc-950 mt-1">136/84 mmHg</p>
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Stage 1 Pre-hypertension</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Heart Rate</span>
                <p className="text-base font-bold text-zinc-950 mt-1">72 bpm</p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Normal Sinus</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Oxygen (SpO2)</span>
                <p className="text-base font-bold text-zinc-950 mt-1">99%</p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Room air</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">BMI Index</span>
                <p className="text-base font-bold text-zinc-950 mt-1">26.0</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Weight: 82.5 kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Medications & Lab Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Prescriptions */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <Pill className="w-4 h-4 text-zinc-900" />
                Active Prescriptions
              </h3>
              <Link href="/patient/prescriptions" className="text-xs font-semibold text-zinc-950 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {myPrescriptions.length > 0 ? (
                myPrescriptions[0].items.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                    <p className="font-bold text-zinc-950">{item.medicineName} ({item.dosage})</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{item.frequency}</p>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-zinc-400">No active medications.</div>
              )}
            </div>
          </div>

          {/* Recent Lab Tests */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-zinc-900" />
                Recent Lab Results
              </h3>
              <Link href="/patient/lab-reports" className="text-xs font-semibold text-zinc-950 hover:underline">
                Reports
              </Link>
            </div>

            <div className="space-y-2">
              {myLabs.map((lab) => (
                <div key={lab.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-zinc-950">{lab.testName}</p>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{lab.status}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{lab.summaryConclusion || 'Pending'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Overview */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-900" />
                Billing & Account
              </h3>
              <Link href="/patient/billing" className="text-xs font-semibold text-zinc-950 hover:underline">
                Invoices
              </Link>
            </div>

            {pendingBill ? (
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-zinc-950">
                  <span>Balance Due:</span>
                  <span>${pendingBill.balanceDue.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Statement {pendingBill.invoiceNumber} • Due {formatDate(pendingBill.dueDate)}
                </p>
                <Link
                  href="/patient/billing"
                  className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs text-center block transition-colors"
                >
                  Pay Balance Online
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                ✓ Account settled in full. No outstanding payments due.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Prescription } from '@/types';
import { Pill, Printer, Clock, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientPrescriptionsPage() {
  const { currentUser, prescriptions } = useHospitalStore();
  const userMrn = currentUser.patientMrn || 'MRN-84291';
  const myPrescriptions = prescriptions.filter((p) => p.patientMrn === userMrn);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(myPrescriptions[0] || null);

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Electronic Pharmacy Formulary
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Active Prescriptions & Medication Schedules
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Digitally signed prescriptions by your attending physicians with dosage instructions and refill triggers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List of Prescriptions */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prescription Records</h3>
            <div className="space-y-3">
              {myPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedRx?.id === rx.id
                      ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-zinc-900">{rx.prescriptionNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {rx.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-zinc-900 mt-1">
                    {rx.doctorName} ({rx.doctorSpecialty})
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Indication: {rx.diagnosis}
                  </p>

                  <div className="mt-3 pt-2 border-t border-zinc-100 flex justify-between text-[10px] text-zinc-400">
                    <span>Issued: {formatDate(rx.dateIssued)}</span>
                    <span>Valid until: {formatDate(rx.expiryDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Official Rx View */}
          <div className="lg:col-span-7">
            {selectedRx ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6 printable-area">
                {/* Hospital Prescription Letterhead */}
                <div className="flex items-start justify-between pb-6 border-b-2 border-zinc-950">
                  <div>
                    <h3 className="font-black text-xl text-zinc-950 tracking-tight">
                      APEXCARE MEDICAL CENTER
                    </h3>
                    <p className="text-xs text-zinc-500">Department of Quaternary Cardiovascular & Internal Medicine</p>
                    <p className="text-[11px] text-zinc-400">800 Medical Center Pkwy • DEA Reg: BJ4819204</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-zinc-950 font-serif italic">℞</span>
                    <p className="font-mono text-xs font-bold text-zinc-600">{selectedRx.prescriptionNumber}</p>
                  </div>
                </div>

                {/* Patient & Doctor Demographics */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Patient:</span>
                    <p className="font-bold text-zinc-900">{selectedRx.patientName}</p>
                    <p className="text-zinc-500">MRN: {selectedRx.patientMrn} • Age: {selectedRx.patientAge} • {selectedRx.patientGender}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Attending Physician:</span>
                    <p className="font-bold text-zinc-900">{selectedRx.doctorName}</p>
                    <p className="text-zinc-500">{selectedRx.doctorSpecialty}</p>
                  </div>
                </div>

                {/* Medication Items List */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Prescribed Pharmaceuticals & Regimen
                  </h4>
                  <div className="space-y-3">
                    {selectedRx.items.map((item, idx) => (
                      <div key={item.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-zinc-900">
                            {idx + 1}. {item.medicineName} ({item.dosage})
                          </span>
                          <span className="font-semibold text-zinc-500">Route: {item.route}</span>
                        </div>
                        <p className="text-zinc-700">
                          <strong>Frequency & Duration:</strong> {item.frequency} for {item.duration}
                        </p>
                        <p className="text-[11px] text-zinc-500 italic">
                          Instructions: {item.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Directions */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                  <strong className="text-zinc-900 block mb-0.5">Clinical Precaution:</strong>
                  <p className="text-zinc-600">{selectedRx.generalInstructions}</p>
                </div>

                {/* Digital Signature & Print Button */}
                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-mono">Digitally Verified & Signed: {selectedRx.dateIssued}</p>
                    <p className="text-xs font-serif italic text-zinc-700 mt-1">Signed by: {selectedRx.doctorName}, MD</p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    Print Prescription PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-zinc-200">
                Select a prescription to view clinical dosage directions.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

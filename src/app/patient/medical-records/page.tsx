'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Paperclip, Stethoscope } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientMedicalRecordsPage() {
  const { currentUser, medicalRecords } = useHospitalStore();
  const userMrn = currentUser.patientMrn || 'MRN-84291';
  const myRecords = medicalRecords.filter((r) => r.patientMrn === userMrn || r.patientId === currentUser.id);

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Health Informatics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Electronic Health Records & Visit Summaries
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Official clinical encounter documentation, vitals history, and physician discharge notes.
          </p>
        </div>

        <div className="space-y-6">
          {myRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-950">
                      Clinical Encounter with {rec.doctorName}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Encounter Date: <strong>{formatDate(rec.visitDate)}</strong> • ICD-10: <span className="font-mono">{rec.icd10Code || 'I10'}</span>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                  Signed Clinical Note
                </span>
              </div>

              {/* Vitals Recorded */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Blood Pressure</span>
                  <p className="font-bold text-zinc-950 mt-0.5">{rec.vitals.bloodPressure}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Heart Rate</span>
                  <p className="font-bold text-zinc-950 mt-0.5">{rec.vitals.heartRate} bpm</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Temperature</span>
                  <p className="font-bold text-zinc-950 mt-0.5">{rec.vitals.temperature} °F</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Oxygen SpO2</span>
                  <p className="font-bold text-zinc-950 mt-0.5">{rec.vitals.oxygenSaturation}%</p>
                </div>
              </div>

              {/* Chief Complaint, Symptoms, Notes */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-zinc-950 mb-0.5">Chief Complaint:</h4>
                  <p className="text-zinc-600">{rec.chiefComplaint}</p>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-950 mb-0.5">Diagnosis:</h4>
                  <p className="text-zinc-900 font-semibold">{rec.diagnosis}</p>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-950 mb-0.5">Physician Clinical Assessment:</h4>
                  <p className="text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                    {rec.clinicalNotes}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-950 mb-0.5">Treatment Plan:</h4>
                  <p className="text-zinc-600">{rec.treatmentPlan}</p>
                </div>
              </div>

              {/* Attachments */}
              {rec.attachments && rec.attachments.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Diagnostic Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.attachments.map((att, i) => (
                      <button
                        key={i}
                        onClick={() => alert(`Downloading attachment ${att.name}...`)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 border border-zinc-200 transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{att.name}</span>
                        <span className="text-[10px] text-zinc-400">({att.size})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

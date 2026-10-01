'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { LabRequest } from '@/types';
import { Printer } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientLabReportsPage() {
  const { currentUser, labRequests } = useHospitalStore();
  const userMrn = currentUser.patientMrn || 'MRN-84291';
  const myLabs = labRequests.filter((l) => l.patientMrn === userMrn);
  const [selectedLab, setSelectedLab] = useState<LabRequest | null>(myLabs[0] || null);

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Diagnostic Pathology
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Certified Laboratory Test Reports
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Certified biochemical, hematology, and genomic assays verified by ApexCare pathology specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tests List */}
          <div className="lg:col-span-5 space-y-3">
            {myLabs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedLab?.id === lab.id
                    ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-zinc-900">{lab.requestNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {lab.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-zinc-950 mt-1">{lab.testName}</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Ordered by: {lab.doctorName}</p>
                <div className="mt-3 pt-2 border-t border-zinc-100 flex justify-between text-[10px] text-zinc-400">
                  <span>Category: {lab.testCategory}</span>
                  <span>{formatDate(lab.requestedDate)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Report Sheet View */}
          <div className="lg:col-span-7">
            {selectedLab ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6 printable-area">
                <div className="flex items-start justify-between pb-6 border-b border-zinc-100">
                  <div>
                    <h3 className="font-black text-lg text-zinc-950">
                      APEXCARE CLINICAL LABORATORIES
                    </h3>
                    <p className="text-xs text-zinc-500">CLIA Certificate: 14D0948192 • CAP Accredited</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="no-print px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Patient:</span>
                    <p className="font-bold text-zinc-950">{selectedLab.patientName}</p>
                    <p className="text-zinc-500">{selectedLab.patientMrn}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Specimen Status:</span>
                    <p className="font-bold text-emerald-700 uppercase">{selectedLab.status}</p>
                    <p className="text-zinc-500">Verified by: {selectedLab.technicianName || 'Dr. Rachel Gomez'}</p>
                  </div>
                </div>

                {/* Analytical Findings */}
                {selectedLab.results && selectedLab.results.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Biomarker Readings
                    </h4>
                    <div className="rounded-xl border border-zinc-200 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-semibold text-[10px] uppercase">
                          <tr>
                            <th className="px-4 py-2.5">Biomarker / Assay</th>
                            <th className="px-4 py-2.5">Result</th>
                            <th className="px-4 py-2.5">Reference Interval</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {selectedLab.results.map((r, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2.5 font-medium text-zinc-800">{r.name}</td>
                              <td className="px-4 py-2.5 font-mono font-bold text-zinc-950">
                                {r.result} {r.unit}
                              </td>
                              <td className="px-4 py-2.5 text-zinc-500">{r.referenceRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedLab.summaryConclusion && (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                    <span className="font-bold text-zinc-950 block mb-1">
                      Pathologist Clinical Conclusion:
                    </span>
                    <p className="text-zinc-700">{selectedLab.summaryConclusion}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-zinc-200">
                Select a lab report to view analytical biomarker breakdown.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { LabRequest, LabStatus } from '@/types';
import {
  Search,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminLaboratoryPage() {
  const { labRequests, updateLabStatus } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLab, setSelectedLab] = useState<LabRequest | null>(labRequests[0] || null);

  const filtered = labRequests.filter((l) => {
    const matchesSearch =
      l.testName.toLowerCase().includes(search.toLowerCase()) ||
      l.patientName.toLowerCase().includes(search.toLowerCase()) ||
      l.requestNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LabStatus) => {
    switch (status) {
      case 'requested':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'sample_collected':
        return 'bg-zinc-100 text-zinc-800 border border-zinc-200';
      case 'processing':
        return 'bg-zinc-100 text-zinc-900 border border-zinc-300 font-semibold';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
    }
  };

  const advanceWorkflow = (lab: LabRequest) => {
    if (lab.status === 'requested') {
      updateLabStatus(lab.id, 'sample_collected');
    } else if (lab.status === 'sample_collected') {
      updateLabStatus(lab.id, 'processing');
    } else if (lab.status === 'processing') {
      updateLabStatus(
        lab.id,
        'completed',
        [
          { name: 'Primary Biomarker Value', result: '94.2', unit: 'mg/dL', referenceRange: '70 - 99', isAbnormal: false },
          { name: 'Secondary Serum Control', result: '14.0', unit: 'U/L', referenceRange: '10 - 45', isAbnormal: false },
        ],
        'Specimen verified within standard physiological biological boundaries.'
      );
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Laboratory & Specimen Workflow
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Track diagnostic assays through collection, automated biochemistry analysis, and pathologist verification.
          </p>
        </div>

        {/* Workflow Pipeline Indicator */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAEAEA] flex items-center justify-between overflow-x-auto text-xs font-medium text-[#6B7280] gap-2">
          <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 1. Requested
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="flex items-center gap-1.5 text-[#111111] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#111111]" /> 2. Sample Collected
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="flex items-center gap-1.5 text-zinc-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-zinc-500" /> 3. Processing
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> 4. Verified & Dispatched
          </span>
        </div>

        {/* Master List & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search test name, patient, or order ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
              />
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {filtered.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedLab?.id === lab.id
                      ? 'bg-[#F8F8F8] border-[#111111]'
                      : 'bg-white border-[#EAEAEA] hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-medium text-[#6B7280]">{lab.requestNumber}</span>
                      <h4 className="font-semibold text-xs text-[#111111] mt-0.5">{lab.testName}</h4>
                      <p className="text-[11px] text-[#6B7280]">
                        Patient: <strong className="text-[#111111]">{lab.patientName}</strong> ({lab.patientMrn}) • Dr. {lab.doctorName.split(' ')[1]}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] capitalize ${getStatusBadge(lab.status)}`}>
                        {lab.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">{formatDate(lab.requestedDate)}</span>
                    {lab.status !== 'completed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceWorkflow(lab);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-[10px] transition-colors"
                      >
                        Advance State →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Report View Panel */}
          <div className="lg:col-span-6">
            {selectedLab ? (
              <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-[#EAEAEA]">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-[#6B7280] uppercase">
                      Order #{selectedLab.requestNumber}
                    </span>
                    <h3 className="text-base font-bold text-[#111111] mt-0.5">
                      {selectedLab.testName}
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Category: {selectedLab.testCategory} • Priority: <strong className="uppercase text-rose-600">{selectedLab.priority}</strong>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs capitalize ${getStatusBadge(selectedLab.status)}`}>
                    {selectedLab.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA]">
                    <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Patient Information</span>
                    <p className="font-semibold text-[#111111] mt-0.5">{selectedLab.patientName}</p>
                    <p className="text-[11px] text-[#6B7280]">{selectedLab.patientMrn}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA]">
                    <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Ordering Physician</span>
                    <p className="font-semibold text-[#111111] mt-0.5">{selectedLab.doctorName}</p>
                    <p className="text-[11px] text-[#6B7280]">Pathologist: {selectedLab.technicianName || 'Dr. Rachel Gomez'}</p>
                  </div>
                </div>

                {/* Analytical Biomarkers Results Table */}
                {selectedLab.results && selectedLab.results.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">
                      Analytical Findings & Biomarkers
                    </h4>
                    <div className="rounded-lg border border-[#EAEAEA] overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F8F8F8] text-[#6B7280] font-semibold text-[10px] uppercase border-b border-[#EAEAEA]">
                          <tr>
                            <th className="px-4 py-2.5">Biomarker / Assay</th>
                            <th className="px-4 py-2.5">Result</th>
                            <th className="px-4 py-2.5">Reference Range</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAEAEA]">
                          {selectedLab.results.map((r, i) => (
                            <tr key={i} className="hover:bg-zinc-50">
                              <td className="px-4 py-2.5 font-medium text-[#111111]">{r.name}</td>
                              <td className="px-4 py-2.5 font-mono font-semibold text-[#111111]">
                                {r.result} {r.unit}
                              </td>
                              <td className="px-4 py-2.5 text-[#6B7280]">{r.referenceRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#6B7280] rounded-lg bg-[#F8F8F8] border border-[#EAEAEA]">
                    Specimen in queue. Biomarker readings will appear once analyzed.
                  </div>
                )}

                {selectedLab.summaryConclusion && (
                  <div className="p-3.5 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-xs">
                    <span className="font-semibold text-[#111111] block mb-0.5">
                      Pathologist Conclusion:
                    </span>
                    <p className="text-[#6B7280]">{selectedLab.summaryConclusion}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#6B7280] bg-white rounded-xl border border-[#EAEAEA]">
                Select an assay request to review findings.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

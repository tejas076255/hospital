'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Stethoscope,
  Activity,
  Pill,
  Syringe,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PrescriptionItem } from '@/types';

export default function DoctorConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const aptId = params.id as string;

  const { appointments, patients, createPrescription, createLabRequest, updateAppointmentStatus } = useHospitalStore();

  const appointment = appointments.find((a) => a.id === aptId) || appointments[0];
  const patient = patients.find((p) => p.mrn === appointment.patientMrn) || patients[0];

  // Clinical encounter form state
  const [chiefComplaint, setChiefComplaint] = useState(appointment.reason || 'Chest tightness and morning fatigue');
  const [symptoms, setSymptoms] = useState('Lightheadedness upon standing, occasional palpitation, exertional dyspnea');
  const [diagnosis, setDiagnosis] = useState('Essential Stage 1 Systemic Arterial Hypertension');
  const [icd10, setIcd10] = useState('I10');
  const [clinicalNotes, setClinicalNotes] = useState('Cardiac auscultation reveals regular S1/S2 without murmurs. Lungs clear to percussion and auscultation bilaterally. No pedal edema.');
  const [followUpDate, setFollowUpDate] = useState('2026-11-02');

  // Vitals
  const [bp, setBp] = useState('134/82');
  const [hr, setHr] = useState('74');
  const [spo2, setSpo2] = useState('99');
  const [temp, setTemp] = useState('98.6');

  // Prescribed items
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    {
      id: 'item-1',
      medicineName: 'Lisinopril Tablets',
      genericName: 'Lisinopril',
      dosage: '10 mg',
      frequency: 'Once daily in the morning',
      duration: '90 days',
      route: 'Oral',
      instructions: 'Take with or without meals. Log morning blood pressure.',
    },
  ]);

  // Ordered lab tests
  const [orderLab, setOrderLab] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState('Comprehensive Metabolic Panel (CMP) + Lipid Profile');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddItem = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      {
        id: `med-${Date.now()}`,
        medicineName: 'Atorvastatin Calcium',
        genericName: 'Atorvastatin',
        dosage: '20 mg',
        frequency: 'Once daily at bedtime',
        duration: '90 days',
        route: 'Oral',
        instructions: 'Take at night. Avoid grapefruit juice.',
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx));
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Create digital prescription
    if (prescriptionItems.length > 0) {
      createPrescription({
        patientId: patient.id,
        patientName: patient.fullName,
        patientMrn: patient.mrn,
        patientAge: 44,
        patientGender: patient.gender,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        doctorSpecialty: appointment.doctorSpecialty,
        diagnosis,
        items: prescriptionItems,
        generalInstructions: 'Follow DASH dietary principles. Drink at least 2L of water daily. Monitor resting blood pressure.',
        expiryDate: '2027-04-01',
      });
    }

    // 2. Create lab request if ordered
    if (orderLab) {
      createLabRequest({
        patientId: patient.id,
        patientName: patient.fullName,
        patientMrn: patient.mrn,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        testCategory: 'Biochemistry',
        testName: selectedLabTest,
        priority: 'routine',
        cost: 120,
      });
    }

    // 3. Mark appointment completed
    updateAppointmentStatus(appointment.id, 'completed');

    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/doctor/appointments');
    }, 1500);
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Consultation: {patient.fullName} ({patient.mrn})
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Attending: {appointment.doctorName} • Suite 304 • {formatDate(appointment.date)}
            </p>
          </div>

          <span className="px-3 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 w-fit">
            Clinical Session In-Progress
          </span>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Consultation note signed. Digital prescription issued and lab request dispatched.
          </div>
        )}

        <form onSubmit={handleSaveConsultation} className="space-y-6">
          {/* Patient Vitals Entry */}
          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
            <h3 className="font-semibold text-xs text-[#111111] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#111111]" />
              Bedside Vital Signs
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[#6B7280] mb-1 font-medium">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] font-mono font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] mb-1 font-medium">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] font-mono font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] mb-1 font-medium">SpO2 Oxygen (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] font-mono font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] mb-1 font-medium">Body Temp (°F)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] font-mono font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Clinical Assessment & Diagnosis */}
          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
            <h3 className="font-semibold text-xs text-[#111111] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#111111]" />
              Assessment & Clinical Diagnosis
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Chief Complaint</label>
                  <input
                    type="text"
                    required
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Reported Symptoms</label>
                  <input
                    type="text"
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-medium text-[#111111] mb-1">Primary Clinical Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">ICD-10 Code</label>
                  <input
                    type="text"
                    value={icd10}
                    onChange={(e) => setIcd10(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] font-mono text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111111] mb-1">Objective Physical Exam & Doctor Notes</label>
                <textarea
                  rows={3}
                  required
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Electronic Prescription Form (Rx) */}
          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#111111] flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#111111]" />
                Prescribe Pharmaceuticals (Digital Rx)
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] font-medium text-xs hover:bg-zinc-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medication
              </button>
            </div>

            <div className="space-y-3">
              {prescriptionItems.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[#6B7280] mb-1">Medicine Name & Generic</label>
                      <input
                        type="text"
                        value={item.medicineName}
                        onChange={(e) => {
                          const updated = [...prescriptionItems];
                          updated[idx].medicineName = e.target.value;
                          setPrescriptionItems(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] font-semibold text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B7280] mb-1">Dosage</label>
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(e) => {
                          const updated = [...prescriptionItems];
                          updated[idx].dosage = e.target.value;
                          setPrescriptionItems(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B7280] mb-1">Duration</label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => {
                          const updated = [...prescriptionItems];
                          updated[idx].duration = e.target.value;
                          setPrescriptionItems(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] text-[#111111]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={item.frequency}
                      onChange={(e) => {
                        const updated = [...prescriptionItems];
                        updated[idx].frequency = e.target.value;
                        setPrescriptionItems(updated);
                      }}
                      placeholder="Frequency e.g. Twice daily after meals"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] text-[#111111]"
                    />
                    {prescriptionItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Lab Request Order */}
          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#111111] flex items-center gap-2">
                <Syringe className="w-4 h-4 text-[#111111]" />
                Order Laboratory Diagnostics
              </h3>
              <label className="flex items-center gap-2 text-xs font-medium text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={orderLab}
                  onChange={(e) => setOrderLab(e.target.checked)}
                  className="rounded text-[#111111] w-4 h-4 accent-[#111111]"
                />
                <span>Include Lab Order</span>
              </label>
            </div>

            {orderLab && (
              <div className="text-xs space-y-2">
                <label className="block text-[#6B7280] font-medium">Select Test Assay</label>
                <select
                  value={selectedLabTest}
                  onChange={(e) => setSelectedLabTest(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[#111111]"
                >
                  <option>Comprehensive Metabolic Panel (CMP) + Lipid Profile</option>
                  <option>Complete Blood Count (CBC) with Differential</option>
                  <option>Hemoglobin A1c (HbA1c) Glycated</option>
                  <option>High-Sensitivity Cardiac Troponin-I (STAT)</option>
                  <option>12-Lead Electrocardiogram (ECG) Analysis</option>
                </select>
              </div>
            )}
          </div>

          {/* Schedule Follow-up & Complete */}
          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <Calendar className="w-4 h-4 text-[#111111]" />
              <div>
                <span className="font-semibold block text-[#111111]">Recommended Follow-up:</span>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="px-2 py-1 rounded-md bg-white border border-[#EAEAEA] font-semibold text-[#111111]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Encounter & Sign Prescription
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}

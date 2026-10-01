'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useHospitalStore } from '@/lib/data/store';
import {
  CheckCircle2,
  Stethoscope,
  Building2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedDoctor = searchParams.get('doctor');
  const preselectedDept = searchParams.get('dept');

  const { doctors, departments, bookAppointment, currentUser } = useHospitalStore();

  const [step, setStep] = useState<number>(1);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    preselectedDept || departments[0]?.id || ''
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctor || doctors[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-06');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00');
  const [consultType, setConsultType] = useState<'in_person' | 'video_consult'>('in_person');
  const [reason, setReason] = useState<string>('Cardiology regular checkup and blood pressure assessment');

  // Patient info
  const [patientName, setPatientName] = useState(currentUser.fullName || 'James Wilson');
  const [patientEmail, setPatientEmail] = useState(currentUser.email || 'james.wilson@gmail.com');
  const [patientPhone, setPatientPhone] = useState(currentUser.phone || '+1 (555) 890-1234');
  const [patientMrn, setPatientMrn] = useState(currentUser.patientMrn || 'MRN-84291');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  // Filter doctors by selected department
  const filteredDoctors = useMemo(() => {
    if (!selectedDeptId) return doctors;
    return doctors.filter((d) => d.departmentId === selectedDeptId);
  }, [doctors, selectedDeptId]);

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const currentDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const handleConfirm = () => {
    setErrorMsg(null);
    try {
      const apt = bookAppointment({
        patientId: currentUser.id || 'pat-1',
        patientName,
        patientMrn,
        patientPhone,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.fullName,
        doctorSpecialty: currentDoctor.specialization,
        departmentId: currentDept.id,
        departmentName: currentDept.name,
        date: selectedDate,
        time: selectedSlot,
        type: consultType,
        reason,
        fee: currentDoctor.consultationFee,
      });

      setConfirmedAppointment(apt);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to book slot. Double booking detected.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Book a Medical Consultation
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              Select your department, specialist physician, and preferred appointment time.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {[
              { num: 1, label: 'Department & Doctor' },
              { num: 2, label: 'Date & Time Slot' },
              { num: 3, label: 'Patient Information' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => (
              <div
                key={s.num}
                className={`p-3 rounded-lg text-center border transition-all ${
                  step === s.num
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : step > s.num
                    ? 'bg-zinc-100 text-[#111111] border-[#EAEAEA]'
                    : 'bg-white text-[#9CA3AF] border-[#EAEAEA]'
                }`}
              >
                <span className="text-xs font-semibold block">{s.num}. {s.label.split(' ')[0]}</span>
                <span className="text-[10px] hidden sm:block opacity-80">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <strong>Appointment Conflict:</strong> {errorMsg}
              </div>
            </div>
          )}

          {/* STEP 1: Select Department & Doctor */}
          {step === 1 && (
            <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#111111]" />
                  1. Select Clinical Department
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        const match = doctors.find((d) => d.departmentId === dept.id);
                        if (match) setSelectedDoctorId(match.id);
                      }}
                      className={`p-3.5 rounded-lg text-left border text-xs transition-all ${
                        selectedDeptId === dept.id
                          ? 'border-[#111111] bg-[#F8F8F8] text-[#111111] font-semibold'
                          : 'border-[#EAEAEA] hover:border-zinc-300 text-[#6B7280]'
                      }`}
                    >
                      <p className="font-semibold truncate text-[#111111]">{dept.name.split('&')[0]}</p>
                      <p className="text-[10px] text-[#6B7280] mt-0.5">{dept.code} • {dept.activeDoctorsCount} MDs</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA]">
                <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-3">
                  <Stethoscope className="w-4 h-4 text-[#111111]" />
                  2. Select Physician / Specialist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDoctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-3.5 rounded-lg text-left border flex items-start gap-3 transition-all ${
                        selectedDoctorId === doc.id
                          ? 'border-[#111111] bg-[#F8F8F8] text-[#111111] font-semibold'
                          : 'border-[#EAEAEA] hover:border-zinc-300 text-[#6B7280]'
                      }`}
                    >
                      <img
                        src={doc.avatarUrl}
                        alt={doc.fullName}
                        className="w-10 h-10 rounded-md object-cover border border-[#EAEAEA] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs truncate text-[#111111]">{doc.fullName}</p>
                        <p className="text-[11px] text-[#6B7280] truncate">{doc.specialization}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">Fee: ${doc.consultationFee} • {doc.rating} ★</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  Proceed to Date & Slot <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Available Slots */}
          {step === 2 && (
            <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
                <div>
                  <h3 className="text-sm font-semibold text-[#111111]">
                    Select Consultation Date & Time
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Booking with <strong className="text-[#111111]">{currentDoctor.fullName}</strong> ({currentDoctor.specialization})
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#111111] bg-[#F8F8F8] px-2.5 py-1 rounded-md border border-[#EAEAEA]">
                  Fee: ${currentDoctor.consultationFee}
                </span>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-2">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConsultType('in_person')}
                    className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                      consultType === 'in_person'
                        ? 'border-[#111111] bg-[#F8F8F8] text-[#111111]'
                        : 'border-[#EAEAEA] text-[#6B7280]'
                    }`}
                  >
                    Hospital Visit ({currentDoctor.roomNumber})
                  </button>
                  <button
                    onClick={() => setConsultType('video_consult')}
                    className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                      consultType === 'video_consult'
                        ? 'border-[#111111] bg-[#F8F8F8] text-[#111111]'
                        : 'border-[#EAEAEA] text-[#6B7280]'
                    }`}
                  >
                    Telehealth Video Consultation
                  </button>
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs font-medium text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              {/* Slots */}
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-2">
                  Available Consultation Slots ({currentDoctor.availableSlots.length} Open)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {currentDoctor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg font-mono text-xs font-semibold text-center border transition-all ${
                        selectedSlot === slot
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#EAEAEA] hover:border-zinc-300 text-[#111111]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#6B7280] hover:text-[#111111] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  Patient Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information & Review */}
          {step === 3 && (
            <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">
                  Patient & Clinical Visit Details
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Enter patient details and reason for consultation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">
                    Medical Record Number (MRN)
                  </label>
                  <input
                    type="text"
                    value={patientMrn}
                    onChange={(e) => setPatientMrn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Reason for Visit / Primary Symptoms *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-xs space-y-1.5">
                <p className="font-semibold text-[#111111]">Consultation Summary:</p>
                <p className="text-[#6B7280]">
                  • <strong>Doctor:</strong> {currentDoctor.fullName} ({currentDoctor.specialization})
                </p>
                <p className="text-[#6B7280]">
                  • <strong>Schedule:</strong> {selectedDate} at {selectedSlot} ({consultType === 'in_person' ? 'In-Person Visit' : 'Telemedicine'})
                </p>
                <p className="text-[#6B7280]">
                  • <strong>Estimated Consultation Fee:</strong> ${currentDoctor.consultationFee}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#6B7280] hover:text-[#111111] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  Confirm & Schedule <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && confirmedAppointment && (
            <div className="p-8 sm:p-10 rounded-xl bg-white border border-[#EAEAEA] text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#111111]">
                  Appointment Confirmed
                </h2>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                  A confirmation SMS and email reminder have been dispatched to {patientEmail}.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-[#EAEAEA] pb-2">
                  <span className="text-[#6B7280]">Appointment ID:</span>
                  <span className="font-mono font-semibold text-[#111111]">{confirmedAppointment.id}</span>
                </div>
                <div className="flex justify-between border-b border-[#EAEAEA] pb-2">
                  <span className="text-[#6B7280]">Physician:</span>
                  <span className="font-semibold text-[#111111]">{confirmedAppointment.doctorName}</span>
                </div>
                <div className="flex justify-between border-b border-[#EAEAEA] pb-2">
                  <span className="text-[#6B7280]">Date & Slot:</span>
                  <span className="font-semibold text-[#111111]">{confirmedAppointment.date} at {confirmedAppointment.time}</span>
                </div>
                <div className="flex justify-between border-b border-[#EAEAEA] pb-2">
                  <span className="text-[#6B7280]">Patient:</span>
                  <span className="font-semibold text-[#111111]">{confirmedAppointment.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Fee:</span>
                  <span className="font-semibold text-emerald-700">${confirmedAppointment.fee} (Pay upon check-in)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/patient/appointments"
                  className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs"
                >
                  View in Patient Portal
                </Link>
                <button
                  onClick={() => {
                    setConfirmedAppointment(null);
                    setStep(1);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-[#EAEAEA] text-[#111111] bg-white hover:bg-zinc-50 font-medium text-xs"
                >
                  Book Another Visit
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-[#6B7280]">Loading booking portal...</p>
        </div>
      }
    >
      <BookAppointmentContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Patient } from '@/types';
import {
  Search,
  Plus,
  Calendar,
  Activity,
  CreditCard,
  Syringe,
  Pill,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPatientsPage() {
  const { patients, addPatient, appointments, prescriptions, labRequests, invoices } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New patient state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1985-04-12',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    address: '100 North Michigan Ave, Chicago, IL',
    emergencyName: 'Sarah Wilson',
    emergencyRelationship: 'Spouse',
    emergencyPhone: '+1 (555) 890-5555',
    insuranceProvider: 'BlueCross BlueShield',
    insurancePolicyNumber: 'BCBS-IL-88412',
  });

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPat = addPatient({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      address: form.address,
      allergies: ['None recorded'],
      chronicDiseases: [],
      emergencyContact: {
        name: form.emergencyName,
        relationship: form.emergencyRelationship,
        phone: form.emergencyPhone,
      },
      insuranceProvider: form.insuranceProvider,
      insurancePolicyNumber: form.insurancePolicyNumber,
    });
    setSelectedPatient(newPat);
    setShowAddModal(false);
  };

  // Compile timeline for currently selected patient
  const patientAppointments = appointments.filter((a) => a.patientId === selectedPatient?.id || a.patientMrn === selectedPatient?.mrn);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === selectedPatient?.id || p.patientMrn === selectedPatient?.mrn);
  const patientLabs = labRequests.filter((l) => l.patientId === selectedPatient?.id || l.patientMrn === selectedPatient?.mrn);
  const patientInvoices = invoices.filter((i) => i.patientId === selectedPatient?.id || i.patientMrn === selectedPatient?.mrn);

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Electronic Health Records
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Master Patient Registry & Medical Timelines
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Search by MRN, create patient records, and review integrated clinical episodes.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-all self-start sm:self-auto active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Register New Patient
          </button>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Patients Table List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient by MRN, name, or phone..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 shadow-2xs"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {filteredPatients.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatient(pat)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedPatient?.id === pat.id
                      ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                        {pat.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-zinc-950">
                          {pat.fullName}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-mono font-medium">
                          {pat.mrn} • {pat.gender}, {pat.bloodGroup}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      DOB: {formatDate(pat.dateOfBirth)}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{pat.phone}</span>
                    <span className="flex items-center gap-1 text-zinc-950 font-semibold">
                      View timeline <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Patient Profile & Clinical Timeline */}
          <div className="lg:col-span-7">
            {selectedPatient ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6">
                {/* Patient Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-zinc-950 text-white font-black text-xl flex items-center justify-center">
                      {selectedPatient.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-zinc-950">
                          {selectedPatient.fullName}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {selectedPatient.mrn}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Blood Group: <strong className="text-rose-600">{selectedPatient.bloodGroup}</strong> • Gender: {selectedPatient.gender} • Registered: {formatDate(selectedPatient.registeredDate)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                    Active Patient Record
                  </span>
                </div>

                {/* Contact & Insurance Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Contact Phone</span>
                    <p className="font-bold text-zinc-900 mt-0.5">{selectedPatient.phone}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Insurance Policy</span>
                    <p className="font-bold text-zinc-900 mt-0.5 truncate">{selectedPatient.insuranceProvider || 'Private Pay'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Known Allergies</span>
                    <p className="font-bold text-rose-600 mt-0.5 truncate">
                      {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'None'}
                    </p>
                  </div>
                </div>

                {/* Patient Timeline */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-zinc-900" />
                    Integrated Patient Clinical Timeline
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                    {/* Consultations */}
                    {patientAppointments.map((apt) => (
                      <div key={apt.id} className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 ring-4 ring-white" />
                        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-zinc-900" />
                              Consultation: {apt.doctorName}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-semibold">{apt.date} at {apt.time}</span>
                          </div>
                          <p className="text-zinc-600">
                            Reason: {apt.reason} • Status: <strong className="capitalize text-zinc-900">{apt.status}</strong>
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Prescriptions */}
                    {patientPrescriptions.map((rx) => (
                      <div key={rx.id} className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 ring-4 ring-white" />
                        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-zinc-900" />
                              Prescription Issued ({rx.prescriptionNumber})
                            </span>
                            <span className="text-[10px] text-zinc-400">{rx.dateIssued}</span>
                          </div>
                          <p className="text-zinc-700">
                            Medications: {rx.items.map((i) => `${i.medicineName} (${i.dosage})`).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Lab Tests */}
                    {patientLabs.map((lab) => (
                      <div key={lab.id} className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-500 ring-4 ring-white" />
                        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                              <Syringe className="w-3.5 h-3.5 text-zinc-900" />
                              Lab Test: {lab.testName}
                            </span>
                            <span className="text-[10px] text-zinc-400 capitalize">{lab.status}</span>
                          </div>
                          <p className="text-zinc-600">
                            Conclusion: {lab.summaryConclusion || 'Processing under pathology department'}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Payments */}
                    {patientInvoices.map((inv) => (
                      <div key={inv.id} className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-zinc-900" />
                              Invoice {inv.invoiceNumber}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase">
                              {inv.status}
                            </span>
                          </div>
                          <p className="text-zinc-600">
                            Total: ${inv.totalAmount.toFixed(2)} • Paid: ${inv.paidAmount.toFixed(2)} • Balance: ${inv.balanceDue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-zinc-200">
                Select a patient from the registry to view clinical timeline and electronic records.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Register Patient Form */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className="fixed inset-0"
              onClick={() => setShowAddModal(false)}
            />
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    Patient Registration Intake
                  </h3>
                  <p className="text-xs text-zinc-500">
                    A unique Medical Record Number (MRN) will be automatically generated.
                  </p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700">✕</button>
              </div>

              <form onSubmit={handleCreatePatient} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={form.dateOfBirth}
                      onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Blood Group</label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    >
                      <option>O+</option>
                      <option>O-</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    Save & Generate MRN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

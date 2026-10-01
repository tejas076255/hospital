'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { CheckCircle2 } from 'lucide-react';

export default function ReceptionistRegistrationPage() {
  const { addPatient } = useHospitalStore();
  const [createdPatient, setCreatedPatient] = useState<any>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1990-01-01',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    address: 'Chicago, IL',
    emergencyName: '',
    emergencyPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = addPatient({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      address: form.address,
      allergies: [],
      chronicDiseases: [],
      emergencyContact: {
        name: form.emergencyName || 'Family Member',
        relationship: 'Emergency',
        phone: form.emergencyPhone || form.phone,
      },
    });
    setCreatedPatient(pat);
  };

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Intake Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Walk-in Patient Rapid Registration
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Rapid identity capture and immediate Medical Record Number (MRN) barcode issuance.
          </p>
        </div>

        {createdPatient ? (
          <div className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-zinc-950">Patient Record Created</h3>
            <p className="text-xs text-zinc-500">
              MRN: <strong className="font-mono text-sm text-zinc-950">{createdPatient.mrn}</strong> for {createdPatient.fullName}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setCreatedPatient(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all active:scale-[0.98]"
              >
                Register Another Walk-in
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-zinc-700">Full Legal Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-zinc-700">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-zinc-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-zinc-700">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-zinc-700">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-zinc-700">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              Issue Patient MRN
            </button>
          </form>
        )}
      </div>
    </PortalLayout>
  );
}

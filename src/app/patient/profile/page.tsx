'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Save, CheckCircle2 } from 'lucide-react';

export default function PatientProfilePage() {
  const { currentUser, setCurrentUser } = useHospitalStore();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone || '+1 (555) 890-1234',
    address: currentUser.address || '742 Evergreen Terrace, Springfield, IL',
    emergencyContactName: currentUser.emergencyContactName || 'Emily Wilson',
    emergencyContactPhone: currentUser.emergencyContactPhone || '+1 (555) 890-5678',
    bloodGroup: currentUser.bloodGroup || 'O+',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone,
      bloodGroup: form.bloodGroup,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Account Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Patient Demographics & Medical Contacts
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Maintain your legal identity, emergency contacts, and notification preferences.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Patient profile details saved and synchronized across the hospital registry.
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-zinc-100">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
            />
            <div>
              <h3 className="font-bold text-base text-zinc-950">{currentUser.fullName}</h3>
              <p className="text-xs text-zinc-600 font-mono font-semibold">
                {currentUser.patientMrn || 'MRN-84291'}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Role: Patient</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
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
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={form.emergencyContactName}
                  onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}

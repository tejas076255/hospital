'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { HeartPulse, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addPatient, switchRole } = useHospitalStore();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '1992-05-15',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    address: '450 Michigan Ave, Chicago, IL',
    emergencyName: 'John Smith',
    emergencyPhone: '+1 (555) 999-1122',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({
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
        name: form.emergencyName,
        relationship: 'Primary Contact',
        phone: form.emergencyPhone,
      },
      insuranceProvider: 'Standard Healthcare',
    });

    switchRole('patient');
    router.push('/patient/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F8F8]">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white">
            <HeartPulse className="w-4 h-4" />
          </div>
          <span className="font-bold text-xl text-[#111111] tracking-tight">
            ApexCare <span className="font-normal text-[#6B7280]">Patient Portal</span>
          </span>
        </Link>
        <p className="text-xs text-[#6B7280]">
          Create an official electronic patient profile for appointment booking and records.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EAEAEA] space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Catherine Morgan"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="catherine@example.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111]"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Blood Group
                </label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111]"
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={form.emergencyName}
                  onChange={(e) => setForm({ ...form, emergencyName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={form.emergencyPhone}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              Complete Registration & Enter Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#6B7280]">
            Already registered?{' '}
            <Link href="/auth/login" className="font-semibold text-[#111111] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

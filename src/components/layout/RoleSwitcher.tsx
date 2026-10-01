'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { UserRole } from '@/types';
import { Shield, ChevronDown, Check, Stethoscope, HeartHandshake, Syringe, Pill, User } from 'lucide-react';

const ROLES: { role: UserRole; label: string; path: string; icon: any }[] = [
  { role: 'admin', label: 'Hospital Admin', path: '/admin/dashboard', icon: Shield },
  { role: 'doctor', label: 'Chief Doctor (Dr. Jenkins)', path: '/doctor/dashboard', icon: Stethoscope },
  { role: 'patient', label: 'Patient (James Wilson)', path: '/patient/dashboard', icon: User },
  { role: 'receptionist', label: 'Reception & Triage', path: '/receptionist/dashboard', icon: HeartHandshake },
  { role: 'lab_staff', label: 'Laboratory Diagnostics', path: '/laboratory/dashboard', icon: Syringe },
  { role: 'pharmacy_staff', label: 'Pharmacy Dispensary', path: '/pharmacy/dashboard', icon: Pill },
];

export function RoleSwitcher() {
  const router = useRouter();
  const { currentUser, switchRole } = useHospitalStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentRoleConfig = ROLES.find((r) => r.role === currentUser.role) || ROLES[0];
  const Icon = currentRoleConfig.icon;

  const handleSelectRole = (r: (typeof ROLES)[0]) => {
    switchRole(r.role);
    setIsOpen(false);
    router.push(r.path);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 border border-zinc-200 transition-all shadow-2xs"
        title="Switch user role demo"
      >
        <Icon className="w-3.5 h-3.5 text-zinc-900" />
        <span className="hidden sm:inline text-zinc-500">Role:</span>
        <span className="font-bold text-zinc-900">{currentRoleConfig.label.split(' ')[0]}</span>
        <ChevronDown className="w-3 h-3 text-zinc-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-zinc-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Interactive Role Switcher</p>
              <p className="text-xs text-zinc-500 mt-0.5">Switch perspective to test role permissions</p>
            </div>
            <div className="p-1 space-y-0.5">
              {ROLES.map((r) => {
                const ItemIcon = r.icon;
                const isSelected = currentUser.role === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleSelectRole(r)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                      <span>{r.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

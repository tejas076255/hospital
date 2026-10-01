'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Search } from 'lucide-react';

export default function AdminStaffPage() {
  const { users } = useHospitalStore();
  const [search, setSearch] = useState('');

  const staff = users.filter((u) => u.role !== 'patient');
  const filtered = staff.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Staff Directory
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Nurses, laboratory technologists, pharmacy clinicians, and administrative staff.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or role..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-xl bg-white border border-[#EAEAEA] flex items-start gap-3.5"
            >
              <img
                src={s.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={s.fullName}
                className="w-12 h-12 rounded-lg object-cover border border-[#EAEAEA] shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block capitalize">
                  {s.role.replace('_', ' ')}
                </span>
                <h3 className="font-semibold text-xs text-[#111111] truncate mt-0.5">
                  {s.fullName}
                </h3>
                <p className="text-xs text-[#6B7280] truncate mt-0.5">{s.email}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">{s.phone || '+1 (555) 000-0000'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

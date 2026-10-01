'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Search } from 'lucide-react';

export default function AdminDoctorsPage() {
  const { doctors, departments } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filtered = doctors.filter((doc) => {
    const matchesSearch =
      doc.fullName.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Clinical Faculty
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Physician & Specialist Administration
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Manage doctor schedules, department affiliations, room assignments, and consultation tariffs.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search physician or specialty..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDept === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              All Departments
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDept === d.id
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {d.code}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      ● Active Duty
                    </span>
                    <h3 className="font-bold text-sm text-zinc-950 truncate">
                      {doc.fullName}
                    </h3>
                    <p className="text-xs text-zinc-600 font-medium truncate">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {doc.departmentName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Qualification:</span>
                    <strong className="text-zinc-950 truncate max-w-[180px]">{doc.qualification}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Consultation Fee:</span>
                    <strong className="text-emerald-700 font-semibold">${doc.consultationFee}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Assigned Suite:</span>
                    <span className="text-zinc-800 font-medium">{doc.roomNumber}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Performance Rating:</span>
                    <span className="font-bold text-amber-500">{doc.rating} ★ ({doc.reviewCount})</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                    Scheduled Consultation Days
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400">{doc.availableSlots.length} daily time slots</span>
                <span className="text-xs font-semibold text-zinc-950 hover:underline cursor-pointer">
                  Edit Credentials →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

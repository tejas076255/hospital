'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useHospitalStore } from '@/lib/data/store';
import { Search, Star, MapPin, Award } from 'lucide-react';
import { Doctor } from '@/types';

export default function DoctorsPage() {
  const { doctors, departments } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.fullName.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Medical Staff
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-1">
                Board-Certified Physicians & Surgeons
              </h1>
              <p className="text-sm text-zinc-500 mt-2 max-w-xl">
                Search over 180 leading specialists across cardiology, neurosurgery, orthopedic oncology, and critical care.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, specialty, or condition..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDept === 'all'
                  ? 'bg-zinc-900 text-white font-bold shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              All Specialties ({doctors.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDept === dept.id
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {dept.name.split('&')[0].trim()}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl bg-white border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.fullName}
                      className="w-18 h-18 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available This Week
                      </div>
                      <h2 className="text-base font-bold text-zinc-950 truncate">
                        {doc.fullName}
                      </h2>
                      <p className="text-xs font-medium text-zinc-600 truncate mt-0.5">
                        {doc.specialization}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 mt-4 line-clamp-3 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-zinc-700" />
                        Experience:
                      </span>
                      <strong className="text-zinc-950">{doc.experienceYears} Years</strong>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Patient Rating:
                      </span>
                      <strong className="text-zinc-950">{doc.rating} ★ ({doc.reviewCount})</strong>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        Location:
                      </span>
                      <span className="text-zinc-700">{doc.roomNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">Fee</span>
                    <span className="text-sm font-black text-zinc-950">${doc.consultationFee}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                    >
                      Profile
                    </button>
                    <Link
                      href={`/book-appointment?doctor=${doc.id}`}
                      className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Doctor Detail Modal */}
          {selectedDoctor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
              <div
                className="fixed inset-0"
                onClick={() => setSelectedDoctor(null)}
              />
              <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-zinc-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedDoctor.avatarUrl}
                      alt={selectedDoctor.fullName}
                      className="w-18 h-18 rounded-xl object-cover border border-zinc-200"
                    />
                    <div>
                      <h3 className="text-xl font-black text-zinc-950">
                        {selectedDoctor.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-600 mt-0.5">
                        {selectedDoctor.specialization}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {selectedDoctor.departmentName} • {selectedDoctor.roomNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Clinical Biography</h4>
                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                      {selectedDoctor.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <p className="text-[11px] text-zinc-400 font-medium">Education & Honors</p>
                      <p className="text-xs font-bold text-zinc-950 mt-0.5">{selectedDoctor.qualification}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <p className="text-[11px] text-zinc-400 font-medium">Consultation Fee</p>
                      <p className="text-xs font-bold text-zinc-950 mt-0.5">${selectedDoctor.consultationFee}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Available Consultation Days</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.availableDays.map((day) => (
                        <span key={day} className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Standard Slots</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoctor.availableSlots.map((slot) => (
                        <span key={slot} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/book-appointment?doctor=${selectedDoctor.id}`}
                    className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    Schedule Appointment
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useHospitalStore } from '@/lib/data/store';
import { Search, Stethoscope, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function DepartmentsPage() {
  const { departments } = useHospitalStore();
  const [search, setSearch] = useState('');

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Medical Departments & Centers
              </h1>
              <p className="text-xs text-[#6B7280] mt-1 max-w-xl">
                Specialized institutes offering inpatient, outpatient, and critical care medicine.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dept) => (
              <div
                key={dept.id}
                className="rounded-xl bg-white border border-[#EAEAEA] overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-colors"
              >
                <div>
                  <div className="h-44 relative overflow-hidden bg-zinc-100">
                    <img
                      src={dept.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'}
                      alt={dept.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-[#111111] border border-[#EAEAEA]">
                      {dept.code}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h2 className="text-sm font-semibold text-[#111111]">
                      {dept.name}
                    </h2>
                    <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                      {dept.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-[#6B7280] border-t border-[#EAEAEA]">
                      <p className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-[#111111]" />
                        <span>Director: <strong className="text-[#111111]">{dept.headDoctorName}</strong></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>{dept.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#111111]" />
                        <span>{dept.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F8F8] border-t border-[#EAEAEA] flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-700">
                    {dept.availableBedsCount} of {dept.totalBedsCount} Beds Open
                  </span>
                  <Link
                    href={`/book-appointment?dept=${dept.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] hover:underline"
                  >
                    Book Visit <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Star, Calendar } from 'lucide-react';

export default function PatientDoctorsPage() {
  const { doctors } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Care Team
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            My Physicians & Specialist Directory
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Connect with board-certified physicians across cardiology, neurology, pediatrics, and orthopedics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
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
                    <h3 className="font-bold text-sm text-zinc-950 truncate">
                      {doc.fullName}
                    </h3>
                    <p className="text-xs text-zinc-600 font-medium truncate">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{doc.departmentName}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-zinc-400">({doc.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 mt-4 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1 text-xs text-zinc-500">
                  <p>Location: <strong className="text-zinc-800">{doc.roomNumber}</strong></p>
                  <p>Consultation Fee: <strong className="text-zinc-950">${doc.consultationFee}</strong></p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/book-appointment?doctor=${doc.id}`}
                  className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Visit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

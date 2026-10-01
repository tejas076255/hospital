'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';

export default function AdminDepartmentsPage() {
  const { departments } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Departments & Quotas
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Clinical department divisions, medical directors, and inpatient bed allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[#111111] bg-[#F8F8F8] px-2 py-0.5 rounded-md border border-[#EAEAEA]">
                  {dept.code}
                </span>
                <span className="text-xs font-medium text-emerald-700">
                  {dept.availableBedsCount} / {dept.totalBedsCount} Beds Open
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-[#111111]">
                  {dept.name}
                </h3>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                  {dept.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] space-y-1 text-xs text-[#6B7280]">
                <p>Head of Department: <strong className="text-[#111111]">{dept.headDoctorName}</strong></p>
                <p>Location: {dept.location}</p>
                <p>Direct Extension: {dept.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

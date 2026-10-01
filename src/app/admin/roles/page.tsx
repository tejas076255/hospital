'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { Check, X } from 'lucide-react';

const PERMISSIONS = [
  { resource: 'Patient Medical Records', superAdmin: true, admin: true, doctor: true, nurse: true, receptionist: false, lab: false, pharma: false, patient: 'Own' },
  { resource: 'Prescription Issuance (Rx)', superAdmin: true, admin: false, doctor: true, nurse: false, receptionist: false, lab: false, pharma: 'Dispense', patient: 'View' },
  { resource: 'Lab Test Verification', superAdmin: true, admin: false, doctor: 'Order', nurse: false, receptionist: false, lab: true, pharma: false, patient: 'View' },
  { resource: 'Bed & Room Reassignment', superAdmin: true, admin: true, doctor: 'Request', nurse: true, receptionist: true, lab: false, pharma: false, patient: false },
  { resource: 'Pharmacy Formulary & Stock', superAdmin: true, admin: true, doctor: 'Lookup', nurse: false, receptionist: false, lab: false, pharma: true, patient: false },
  { resource: 'Billing & Invoice Settlement', superAdmin: true, admin: true, doctor: false, nurse: false, receptionist: true, lab: false, pharma: false, patient: 'Pay' },
  { resource: 'AI Agent Configuration', superAdmin: true, admin: true, doctor: false, nurse: false, receptionist: false, lab: false, pharma: false, patient: false },
];

export default function AdminRolesPage() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Enforced through Supabase PostgreSQL Row Level Security (RLS) policies and Next.js middleware.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#EAEAEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F8] text-[#6B7280] font-semibold uppercase text-[10px] tracking-wider border-b border-[#EAEAEA]">
                <tr>
                  <th className="px-6 py-3.5">Resource / Domain</th>
                  <th className="px-4 py-3.5 text-center">Super Admin</th>
                  <th className="px-4 py-3.5 text-center">Admin</th>
                  <th className="px-4 py-3.5 text-center">Doctor</th>
                  <th className="px-4 py-3.5 text-center">Nurse</th>
                  <th className="px-4 py-3.5 text-center">Reception</th>
                  <th className="px-4 py-3.5 text-center">Lab Staff</th>
                  <th className="px-4 py-3.5 text-center">Pharmacy</th>
                  <th className="px-4 py-3.5 text-center">Patient</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {PERMISSIONS.map((p, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="px-6 py-3.5 font-medium text-[#111111]">{p.resource}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-emerald-700 font-medium">Full</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {p.admin ? <span className="text-emerald-700 font-medium">Full</span> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {typeof p.doctor === 'boolean' ? (
                        p.doctor ? <Check className="w-3.5 h-3.5 text-emerald-700 mx-auto" /> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] font-medium">{p.doctor}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {p.nurse ? <Check className="w-3.5 h-3.5 text-emerald-700 mx-auto" /> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {p.receptionist ? <Check className="w-3.5 h-3.5 text-emerald-700 mx-auto" /> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {p.lab ? <Check className="w-3.5 h-3.5 text-emerald-700 mx-auto" /> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {typeof p.pharma === 'boolean' ? (
                        p.pharma ? <Check className="w-3.5 h-3.5 text-emerald-700 mx-auto" /> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] font-medium">{p.pharma}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {typeof p.patient === 'boolean' ? (
                        p.patient ? <Check className="w-3.5 h-3.5 text-emerald-700 mx-auto" /> : <X className="w-3.5 h-3.5 text-[#9CA3AF] mx-auto" />
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] font-medium">{p.patient}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

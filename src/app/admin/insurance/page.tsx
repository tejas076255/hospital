'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { ShieldCheck } from 'lucide-react';

const CARRIERS = [
  { name: 'BlueCross BlueShield Premier', planType: 'PPO / HMO Commercial', status: 'In-Network Tier 1', claimTurnaround: '48 hrs', preAuth: 'Electronic EDI' },
  { name: 'UnitedHealthcare Choice Plus', planType: 'National Commercial Network', status: 'In-Network Tier 1', claimTurnaround: '72 hrs', preAuth: 'Portal Pre-Check' },
  { name: 'Medicare Advantage Part C/D', planType: 'Federal CMS', status: 'Approved Quaternary', claimTurnaround: '14 days', preAuth: 'Clinical Necessity' },
  { name: 'Aetna Open Access Health', planType: 'Commercial Regional', status: 'In-Network Tier 1', claimTurnaround: '48 hrs', preAuth: 'Prior Authorization' },
  { name: 'Cigna Global Health Benefits', planType: 'Expatriate & International', status: 'Global Preferred', claimTurnaround: '5 days', preAuth: 'Guaranteed Billing' },
];

export default function AdminInsurancePage() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Insurance Payors & EDI Claims
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Electronic data interchange (EDI 837/835), pre-authorizations, and copayment schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARRIERS.map((c, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {c.status}
                </span>
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
              </div>

              <h3 className="font-semibold text-xs text-[#111111] mt-1">{c.name}</h3>
              <p className="text-xs text-[#6B7280]">{c.planType}</p>

              <div className="pt-3 border-t border-[#EAEAEA] space-y-1 text-xs text-[#6B7280]">
                <p>Turnaround: <strong className="text-[#111111]">{c.claimTurnaround}</strong></p>
                <p>Pre-Authorization: <strong className="text-[#111111]">{c.preAuth}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

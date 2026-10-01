'use client';

import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Pill, AlertTriangle, Package } from 'lucide-react';

export default function PharmacyDashboardPage() {
  const { medicines, prescriptions } = useHospitalStore();

  const lowStock = medicines.filter((m) => m.status === 'low_stock' || m.status === 'out_of_stock');

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Dispensary & Formularies
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Outpatient & Inpatient Pharmacy Dispensary
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Prescription verification, automated pill packaging machines, and cold-chain vaccine logistics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pharmacy/inventory"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
            >
              <Package className="w-4 h-4" />
              Manage Formulary
            </Link>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                <strong>{lowStock.length} items</strong> have reached critical reorder minimums.
              </span>
            </div>
            <Link href="/pharmacy/inventory" className="font-bold underline text-rose-900">
              Restock Formulary →
            </Link>
          </div>
        )}

        {/* Prescription Dispense Queue */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-950 flex items-center gap-2">
              <Pill className="w-5 h-5 text-zinc-950" />
              Electronic Prescriptions Pending Dispensation
            </h3>
            <span className="text-xs font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full">
              {prescriptions.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-zinc-950">{rx.prescriptionNumber}</span>
                    <h4 className="font-bold text-xs text-zinc-950">
                      {rx.patientName} ({rx.patientMrn})
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Prescriber: {rx.doctorName}</p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    Items: {rx.items.map((i) => i.medicineName).join(', ')}
                  </p>
                </div>

                <Link
                  href="/pharmacy/dispense"
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs w-fit active:scale-[0.98] transition-all"
                >
                  Verify & Dispense
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PharmacyInventoryPage() {
  const { medicines, updateMedicineStock } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Formulary Master
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Pharmaceutical Stock & Expiry Ledger
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Batch tracking, cold chain locations, unit pricing, and quantity adjustments.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Medication</th>
                <th className="px-6 py-4">Batch Lot</th>
                <th className="px-6 py-4">Stock In Hand</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Rack Location</th>
                <th className="px-6 py-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {medicines.map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 font-bold text-zinc-950">{m.name}</td>
                  <td className="px-6 py-4 font-mono text-zinc-500">{m.batchNumber}</td>
                  <td className="px-6 py-4 font-bold">
                    <span className={m.quantityInStock <= m.minStockLevel ? 'text-rose-600' : 'text-emerald-700'}>
                      {m.quantityInStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{formatDate(m.expiryDate)}</td>
                  <td className="px-6 py-4 text-zinc-500">{m.locationRack}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updateMedicineStock(m.id, -10)}
                        className="p-1 rounded-md border border-zinc-200 hover:bg-zinc-100 text-rose-600 transition-colors"
                        title="-10 units"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateMedicineStock(m.id, 50)}
                        className="p-1 rounded-md border border-zinc-200 hover:bg-zinc-100 text-emerald-700 transition-colors"
                        title="+50 units"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}

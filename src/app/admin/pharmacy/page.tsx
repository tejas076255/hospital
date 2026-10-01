'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Search,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPharmacyPage() {
  const { medicines, updateMedicineStock } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockItems = medicines.filter((m) => m.status === 'low_stock' || m.status === 'out_of_stock');

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Pharmacy Inventory Control
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Lot tracking, real-time stock decrements, low-stock reorder triggers, and expiry monitoring.
          </p>
        </div>

        {/* Low Stock Warning Banner */}
        {lowStockItems.length > 0 && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900">
                  {lowStockItems.length} Medication(s) Below Minimum Reorder Threshold:
                </strong>
                <p className="text-amber-800 mt-0.5">
                  {lowStockItems.map((m) => `${m.name} (${m.quantityInStock} remaining)`).join(' • ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drug, generic name, or batch lot..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'Cardiovascular', 'Antibiotic', 'Antidiabetic', 'Respiratory'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#6B7280] border border-[#EAEAEA] hover:text-[#111111]'
                }`}
              >
                {cat === 'all' ? 'All Drug Classes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-xl bg-white border border-[#EAEAEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F8] text-[#6B7280] uppercase font-semibold text-[10px] tracking-wider border-b border-[#EAEAEA]">
                <tr>
                  <th className="px-5 py-3.5">Medication & Generic</th>
                  <th className="px-5 py-3.5">Manufacturer & Batch</th>
                  <th className="px-5 py-3.5">Current Stock</th>
                  <th className="px-5 py-3.5">Unit Pricing</th>
                  <th className="px-5 py-3.5">Expiry Date</th>
                  <th className="px-5 py-3.5">Location Rack</th>
                  <th className="px-5 py-3.5 text-right">Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filtered.map((med) => {
                  const isLow = med.quantityInStock <= med.minStockLevel;
                  return (
                    <tr key={med.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-[#111111]">{med.name}</p>
                        <p className="text-[11px] text-[#6B7280]">{med.genericName} • {med.dosageForm}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#111111]">{med.manufacturer}</p>
                        <p className="text-[11px] text-[#6B7280] font-mono">{med.batchNumber}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-semibold text-xs px-2 py-0.5 rounded-md border ${
                            isLow
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {med.quantityInStock} in stock
                        </span>
                        <p className="text-[10px] text-[#9CA3AF] mt-1">Min threshold: {med.minStockLevel}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-[#111111]">${med.sellingPrice.toFixed(2)}</p>
                        <p className="text-[10px] text-[#9CA3AF]">Cost: ${med.unitPrice.toFixed(2)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#6B7280]">{formatDate(med.expiryDate)}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280]">
                        {med.locationRack}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateMedicineStock(med.id, -10)}
                            className="p-1.5 rounded-md border border-[#EAEAEA] hover:bg-zinc-50 text-[#111111]"
                            title="Dispense -10 units"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                          <button
                            onClick={() => updateMedicineStock(med.id, 50)}
                            className="p-1.5 rounded-md border border-[#EAEAEA] hover:bg-zinc-50 text-[#111111]"
                            title="Restock +50 units"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

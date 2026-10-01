'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { Search, User, Stethoscope, Pill, Syringe, Building2, HelpCircle, X } from 'lucide-react';

export function GlobalSearch() {
  const router = useRouter();
  const { doctors, patients, departments, medicines, labRequests, supportTickets } = useHospitalStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Keyboard shortcut CMD+K or CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: { category: string; title: string; subtitle: string; path: string; icon: any }[] = [];

    // Search Doctors
    doctors.forEach((d) => {
      if (d.fullName.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)) {
        items.push({
          category: 'Doctors',
          title: d.fullName,
          subtitle: `${d.specialization} • ${d.departmentName}`,
          path: '/doctors',
          icon: Stethoscope,
        });
      }
    });

    // Search Patients
    patients.forEach((p) => {
      if (p.fullName.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q)) {
        items.push({
          category: 'Patients',
          title: p.fullName,
          subtitle: `MRN: ${p.mrn} • DOB: ${p.dateOfBirth}`,
          path: '/admin/patients',
          icon: User,
        });
      }
    });

    // Search Departments
    departments.forEach((dept) => {
      if (dept.name.toLowerCase().includes(q) || dept.description.toLowerCase().includes(q)) {
        items.push({
          category: 'Departments',
          title: dept.name,
          subtitle: `${dept.location} • Head: ${dept.headDoctorName}`,
          path: '/departments',
          icon: Building2,
        });
      }
    });

    // Search Medicines
    medicines.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) {
        items.push({
          category: 'Pharmacy',
          title: m.name,
          subtitle: `Stock: ${m.quantityInStock} • Rack: ${m.locationRack}`,
          path: '/admin/pharmacy',
          icon: Pill,
        });
      }
    });

    // Search Lab Tests
    labRequests.forEach((lab) => {
      if (lab.testName.toLowerCase().includes(q) || lab.requestNumber.toLowerCase().includes(q)) {
        items.push({
          category: 'Laboratory',
          title: lab.testName,
          subtitle: `Req #${lab.requestNumber} • Patient: ${lab.patientName} (${lab.status})`,
          path: '/laboratory/dashboard',
          icon: Syringe,
        });
      }
    });

    // Search Support Tickets
    supportTickets.forEach((tkt) => {
      if (tkt.ticketNumber.toLowerCase().includes(q) || tkt.subject.toLowerCase().includes(q)) {
        items.push({
          category: 'Support Tickets',
          title: tkt.ticketNumber,
          subtitle: `${tkt.subject} (${tkt.status})`,
          path: '/admin/support',
          icon: HelpCircle,
        });
      }
    });

    return items.slice(0, 8);
  }, [query, doctors, patients, departments, medicines, labRequests, supportTickets]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <>
      {/* Mobile Icon Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors"
        aria-label="Search system"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Desktop / Tablet Bar Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-500 text-xs border border-zinc-200 hover:border-zinc-300 hover:text-zinc-900 transition-all sm:w-44 md:w-52 lg:w-56 justify-between group shadow-2xs"
      >
        <span className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          <span className="truncate">Search system...</span>
        </span>
        <kbd className="inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-600 shadow-2xs border border-zinc-200">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100">
              <Search className="w-5 h-5 text-zinc-950 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors, patients (MRN), medicines, labs, tickets..."
                className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
              />
              {query ? (
                <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-zinc-700">
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[11px] font-medium text-zinc-400 border border-zinc-200 px-1.5 py-0.5 rounded">ESC</span>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  Type to search patients by MRN, doctors by specialty, prescriptions, or departments.
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No matches found for &quot;{query}&quot;. Try searching for &quot;Cardiology&quot;, &quot;Wilson&quot;, or &quot;Lisinopril&quot;.
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-zinc-950">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-600 px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200">
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Quick navigation across hospital departments & records</span>
              <span className="font-semibold text-zinc-700">ApexCare HMS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

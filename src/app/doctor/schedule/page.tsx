'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Clock, Calendar, Check, Save } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

export default function DoctorSchedulePage() {
  const [activeDays, setActiveDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday']);
  const [activeSlots, setActiveSlots] = useState(['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00']);
  const [saved, setSaved] = useState(false);

  const toggleDay = (d: string) => {
    setActiveDays(activeDays.includes(d) ? activeDays.filter((x) => x !== d) : [...activeDays, d]);
  };

  const toggleSlot = (s: string) => {
    setActiveSlots(activeSlots.includes(s) ? activeSlots.filter((x) => x !== s) : [...activeSlots, s]);
  };

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Roster & Availability
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Physician Consultation Availability
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Configure clinic days, consultation blocks, and telemedicine bookable slots.
            </p>
          </div>

          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Schedule'}
          </button>
        </div>

        {/* Days Selection */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-900" />
            Active Clinic Days
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DAYS.map((d) => {
              const active = activeDays.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    active
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{d}</span>
                    {active && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Selection */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-900" />
            Bookable Time Slots
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {SLOTS.map((s) => {
              const active = activeSlots.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSlot(s)}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                    active
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

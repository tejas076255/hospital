'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  PhoneCall,
  Clock,
  Ambulance,
  MapPin,
} from 'lucide-react';

export default function EmergencyPage() {
  const [dispatchRequested, setDispatchRequested] = useState(false);
  const [eta, setEta] = useState<number | null>(null);

  const handleSimulateDispatch = () => {
    setDispatchRequested(true);
    setEta(6);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Emergency Alert Banner */}
          <div className="p-8 sm:p-12 rounded-2xl bg-zinc-950 text-white relative overflow-hidden shadow-sm border border-zinc-900">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                24/7 Level 1 Adult & Pediatric Trauma Center
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Immediate Critical Care Hotline
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                If you or someone around you is experiencing chest pain, acute stroke symptoms, severe trauma, or respiratory distress, call our dedicated trauma line immediately or visit our emergency bay.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="tel:+15559112739"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-rose-600 text-white font-bold text-sm shadow-xs hover:bg-rose-700 transition-all active:scale-[0.98]"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  Call Hotline: +1 (555) 911-APEX
                </a>

                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Ground Floor Emergency Bay, 800 Medical Center Pkwy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Wait Times & Ambulance Triage Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Triage Status */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-950" />
                Real-Time Trauma & ER Status
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Level 1 Triage</span>
                  <p className="text-2xl font-black text-rose-600 mt-1">0 min</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Immediate resuscitation</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Urgent Care (ESI 2-3)</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">&lt; 8 min</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Cardiac / Stroke bay</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Fast-Track ER (ESI 4-5)</span>
                  <p className="text-2xl font-black text-zinc-950 mt-1">12 min</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Minor acute injuries</p>
                </div>
              </div>

              {/* Triage Guidelines */}
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h3 className="text-sm font-bold text-zinc-950">When to Seek Emergency Care:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
                  <li className="flex items-center gap-2">✓ Sudden numbness or facial drooping (FAST stroke)</li>
                  <li className="flex items-center gap-2">✓ Crushing substernal chest pressure or pain</li>
                  <li className="flex items-center gap-2">✓ Severe shortness of breath or anaphylaxis</li>
                  <li className="flex items-center gap-2">✓ Uncontrolled active hemorrhage or deep wounds</li>
                  <li className="flex items-center gap-2">✓ Sudden loss of consciousness or head trauma</li>
                  <li className="flex items-center gap-2">✓ High fever with neck stiffness in infants</li>
                </ul>
              </div>
            </div>

            {/* Mobile Ambulance Dispatch Simulator */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 w-fit border border-rose-200">
                  <Ambulance className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-950">
                  ApexCare Mobile Intensive Care Unit (MICU)
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Our advanced life-support (ALS) ambulances feature telemetry transmission directly to our catheterization and stroke teams while in transit.
                </p>
              </div>

              {!dispatchRequested ? (
                <button
                  onClick={handleSimulateDispatch}
                  className="w-full py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                >
                  <Ambulance className="w-4 h-4" />
                  Simulate Rapid ALS Dispatch Tracking
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      MICU Unit #14 Dispatched
                    </span>
                    <span>ETA: ~{eta} mins</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Trauma team notified. ECG monitor linked with hospital cardiovascular control center.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

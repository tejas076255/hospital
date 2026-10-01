'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    hospitalName: 'ApexCare Medical Center & Quaternary Academic Hospital',
    emergencyHotline: '+1 (555) 911-APEX',
    visitingHoursGeneral: '08:00 AM - 08:00 PM',
    visitingHoursIcu: '11:00 AM - 01:00 PM & 05:00 PM - 07:00 PM',
    telehealthEnabled: true,
    aiTriageEnabled: true,
    doubleBookingAllowed: false,
    defaultCurrency: 'USD ($)',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Settings & Clinical Policies
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Global emergency protocols, visiting hours, and AI assistant configurations.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Hospital operational settings updated and synchronized.
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-5 max-w-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Hospital Registered Name
              </label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Trauma Emergency Hotline
                </label>
                <input
                  type="text"
                  value={settings.emergencyHotline}
                  onChange={(e) => setSettings({ ...settings, emergencyHotline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Default Billing Currency
                </label>
                <input
                  type="text"
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  General Ward Visiting Hours
                </label>
                <input
                  type="text"
                  value={settings.visitingHoursGeneral}
                  onChange={(e) => setSettings({ ...settings, visitingHoursGeneral: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  ICU Visiting Hours
                </label>
                <input
                  type="text"
                  value={settings.visitingHoursIcu}
                  onChange={(e) => setSettings({ ...settings, visitingHoursIcu: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 text-xs text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiTriageEnabled}
                  onChange={(e) => setSettings({ ...settings, aiTriageEnabled: e.target.checked })}
                  className="rounded text-[#111111] focus:ring-[#111111] w-4 h-4 accent-[#111111]"
                />
                <span>Enable AI Autonomous Clinical Assistant with Tool Invocations</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.telehealthEnabled}
                  onChange={(e) => setSettings({ ...settings, telehealthEnabled: e.target.checked })}
                  className="rounded text-[#111111] focus:ring-[#111111] w-4 h-4 accent-[#111111]"
                />
                <span>Enable Secure Telehealth Video Consultations</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAEAEA] flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}

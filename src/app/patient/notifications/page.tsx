'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Check, Calendar, FileText, CreditCard, AlertCircle, Info } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function PatientNotificationsPage() {
  const { notifications, markNotificationRead } = useHospitalStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-zinc-950" />;
      case 'lab':
        return <FileText className="w-4 h-4 text-zinc-950" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-emerald-700" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Alerts & Dispatches
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Notification Center
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Appointment reminders, lab report completions, prescription availability, and billing receipts.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-zinc-200 shadow-xs divide-y divide-zinc-100 overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                n.read ? 'opacity-70 bg-transparent' : 'bg-zinc-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 shadow-2xs shrink-0">
                  {getIcon(n.type)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-950">
                    {n.title}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1.5">{formatDateTime(n.createdAt)}</p>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markNotificationRead(n.id)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

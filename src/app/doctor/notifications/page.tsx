'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Bell } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function DoctorNotificationsPage() {
  const { notifications } = useHospitalStore();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Clinical Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Doctor Notifications & STAT Alerts
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Patient check-in notifications, critical lab biomarker flags, and surgical schedule shifts.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-zinc-200 shadow-xs divide-y divide-zinc-100 overflow-hidden">
          {notifications.map((n) => (
            <div key={n.id} className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-950 border border-zinc-200 shadow-2xs shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-950">{n.title}</h3>
                <p className="text-xs text-zinc-600 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-zinc-400 mt-1">{formatDateTime(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

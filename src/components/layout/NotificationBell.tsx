'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useHospitalStore } from '@/lib/data/store';
import { Bell, Check, Calendar, FileText, CreditCard, AlertCircle, Info } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, markNotificationRead } = useHospitalStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-zinc-900" />;
      case 'lab':
        return <FileText className="w-4 h-4 text-zinc-900" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications"
        className="relative p-2 rounded-lg text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 transition-all border border-zinc-200"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-zinc-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-sm text-zinc-950">Notifications</h3>
                <p className="text-xs text-zinc-500">
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                Live Feed
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">No notifications yet.</div>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 flex gap-3 transition-colors ${
                      notif.read
                        ? 'opacity-70 bg-transparent'
                        : 'bg-zinc-50'
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-lg bg-white shadow-2xs border border-zinc-200 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-bold text-zinc-950 truncate">
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            title="Mark as read"
                            className="text-zinc-400 hover:text-zinc-900 transition-colors p-0.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {formatDateTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 pt-2.5 border-t border-zinc-100 text-center">
              <Link
                href="/patient/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-zinc-950 hover:underline"
              >
                View all notifications →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

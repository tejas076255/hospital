'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Appointment, AppointmentStatus } from '@/types';
import {
  Search,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus, rescheduleAppointment, cancelAppointment } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('2026-10-08');
  const [newTime, setNewTime] = useState('11:00');

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      apt.patientMrn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'checked_in':
        return 'bg-zinc-100 text-zinc-800 border border-zinc-200';
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'completed':
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
    }
  };

  const handleExecuteReschedule = () => {
    if (!rescheduleApt) return;
    try {
      rescheduleAppointment(rescheduleApt.id, newDate, newTime);
      setRescheduleApt(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Appointments
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Full hospital consultation logs with live status updates, check-ins, and schedule coordination.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, MRN, or doctor..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#6B7280] border border-[#EAEAEA] hover:text-[#111111]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* White Table with thin gray borders */}
        <div className="rounded-xl bg-white border border-[#EAEAEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F8] text-[#6B7280] uppercase font-semibold text-[10px] tracking-wider border-b border-[#EAEAEA]">
                <tr>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Physician & Dept</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#111111]">{apt.patientName}</p>
                      <p className="text-[11px] text-[#6B7280] font-mono">{apt.patientMrn}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#111111]">{apt.doctorName}</p>
                      <p className="text-[11px] text-[#6B7280]">{apt.doctorSpecialty}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#111111]">{formatDate(apt.date)}</p>
                      <p className="text-[11px] text-[#6B7280] font-mono">{apt.time} ({apt.type.replace('_', ' ')})</p>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-[#6B7280] truncate">{apt.reason}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium capitalize ${getStatusBadge(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'checked_in')}
                            className="px-2.5 py-1 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-[11px] transition-colors"
                          >
                            Check In
                          </button>
                        )}
                        {apt.status === 'checked_in' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="px-2.5 py-1 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-[11px] transition-colors"
                          >
                            Start Consult
                          </button>
                        )}
                        {apt.status === 'in_progress' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => setRescheduleApt(apt)}
                          className="px-2.5 py-1 rounded-md border border-[#EAEAEA] text-[#111111] bg-white hover:bg-zinc-50 font-medium text-[11px] transition-colors"
                        >
                          Reschedule
                        </button>
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => cancelAppointment(apt.id, 'Cancelled by admin')}
                            className="px-2 py-1 rounded-md text-rose-600 hover:bg-rose-50 text-[11px] font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reschedule Modal */}
        {rescheduleApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setRescheduleApt(null)} />
            <div className="relative w-full max-w-md rounded-xl bg-white border border-[#EAEAEA] shadow-xl p-6 z-10 space-y-4">
              <h3 className="font-bold text-sm text-[#111111]">
                Reschedule Appointment ({rescheduleApt.patientName})
              </h3>
              <p className="text-xs text-[#6B7280]">
                Doctor: {rescheduleApt.doctorName}
              </p>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111]"
                >
                  <option>09:00</option>
                  <option>09:30</option>
                  <option>10:00</option>
                  <option>10:30</option>
                  <option>11:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EAEAEA]">
                <button
                  onClick={() => setRescheduleApt(null)}
                  className="px-3.5 py-2 rounded-lg border border-[#EAEAEA] text-xs font-medium text-[#111111] hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReschedule}
                  className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

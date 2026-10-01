'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Bed, BedStatus } from '@/types';
import {
  BedDouble,
  User,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminBedsPage() {
  const { rooms, patients, updateBedStatus, dischargeBed } = useHospitalStore();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeBedModal, setActiveBedModal] = useState<Bed | null>(null);
  const [admitPatientId, setAdmitPatientId] = useState<string>('');
  const [admitDoctorName, setAdmitDoctorName] = useState<string>('Dr. Sarah Jenkins');

  const allBeds = rooms.flatMap((r) => r.beds);

  const filteredRooms = rooms
    .filter((r) => selectedFloor === 'all' || r.floor === selectedFloor)
    .map((room) => ({
      ...room,
      beds: room.beds.filter((b) => selectedStatus === 'all' || b.status === selectedStatus),
    }))
    .filter((r) => r.beds.length > 0);

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-white border-[#EAEAEA]',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Available',
        };
      case 'occupied':
        return {
          bg: 'bg-[#F8F8F8] border-[#111111]',
          badge: 'bg-[#111111] text-white border-[#111111]',
          dot: 'bg-[#111111]',
          label: 'Occupied',
        };
      case 'reserved':
        return {
          bg: 'bg-white border-[#EAEAEA]',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Reserved',
        };
      case 'cleaning':
        return {
          bg: 'bg-white border-[#EAEAEA]',
          badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          dot: 'bg-zinc-400',
          label: 'Sanitizing',
        };
      case 'maintenance':
        return {
          bg: 'bg-white border-[#EAEAEA]',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Maintenance',
        };
    }
  };

  const handleSaveBedStatus = (newStatus: BedStatus) => {
    if (!activeBedModal) return;

    if (newStatus === 'occupied') {
      const selectedPatient = patients.find((p) => p.id === admitPatientId) || patients[0];
      updateBedStatus(
        activeBedModal.id,
        'occupied',
        {
          id: selectedPatient.id,
          name: selectedPatient.fullName,
          mrn: selectedPatient.mrn,
        },
        admitDoctorName
      );
    } else {
      updateBedStatus(activeBedModal.id, newStatus);
    }

    setActiveBedModal(null);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header & Quick Census */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Bed & Room Management
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Live floor plan across ICU, General Wards, and Private Rooms.
            </p>
          </div>

          {/* Quick Status Legend */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-white border border-[#EAEAEA]">
            {(['available', 'occupied', 'reserved', 'cleaning', 'maintenance'] as BedStatus[]).map((st) => {
              const b = getStatusBadge(st);
              const count = allBeds.filter((bed) => bed.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(selectedStatus === st ? 'all' : st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    selectedStatus === st ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:text-[#111111]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedStatus === st ? 'bg-white' : b.dot}`} />
                  <span className="capitalize">{b.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floor Tabs Filter */}
        <div className="flex items-center gap-1.5 border-b border-[#EAEAEA] pb-3 overflow-x-auto">
          <button
            onClick={() => setSelectedFloor('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFloor === 'all'
                ? 'bg-[#111111] text-white'
                : 'bg-white text-[#6B7280] border border-[#EAEAEA] hover:text-[#111111]'
            }`}
          >
            All Floors
          </button>
          {[1, 2, 3].map((fl) => (
            <button
              key={fl}
              onClick={() => setSelectedFloor(fl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFloor === fl
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#6B7280] border border-[#EAEAEA] hover:text-[#111111]'
              }`}
            >
              Floor {fl} ({fl === 1 ? 'ICU / Trauma' : fl === 2 ? 'General' : 'Cardio & VIP'})
            </button>
          ))}
        </div>

        {/* Rooms & Beds Visual Layout */}
        <div className="space-y-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-md bg-[#F8F8F8] text-[#111111] font-semibold text-xs border border-[#EAEAEA]">
                    Room {room.roomNumber}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#111111]">
                      {room.departmentName}
                    </h3>
                    <p className="text-[11px] text-[#6B7280]">
                      Floor {room.floor} • Type: <strong className="text-[#111111]">{room.type}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#6B7280]">
                  <strong className="text-[#111111]">
                    {room.beds.filter((b) => b.status === 'occupied').length}
                  </strong>{' '}
                  of {room.beds.length} Occupied
                </div>
              </div>

              {/* Visual Bed Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {room.beds.map((bed) => {
                  const badge = getStatusBadge(bed.status);
                  return (
                    <div
                      key={bed.id}
                      onClick={() => {
                        setActiveBedModal(bed);
                        setAdmitPatientId(patients[0]?.id || '');
                      }}
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#111111] flex flex-col justify-between ${badge.bg}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-semibold text-xs text-[#111111] flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-[#111111]" />
                            {bed.bedNumber}
                          </span>
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${badge.badge}`}>
                            {badge.label}
                          </span>
                        </div>

                        {bed.status === 'occupied' && (
                          <div className="space-y-1 text-xs pt-1 border-t border-[#EAEAEA]">
                            <p className="font-medium text-[#111111] truncate">
                              {bed.patientName}
                            </p>
                            <p className="text-[11px] text-[#6B7280]">
                              {bed.patientMrn} • Dr. {bed.assignedDoctorName?.split(' ')[1] || 'Jenkins'}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF]">
                              Adm: {bed.admissionDate ? formatDateTime(bed.admissionDate) : 'Today'}
                            </p>
                          </div>
                        )}

                        {bed.status === 'available' && (
                          <p className="text-xs text-emerald-700 pt-1">
                            Available for intake. Rate: ${bed.dailyRate}/day
                          </p>
                        )}

                        {bed.status === 'cleaning' && (
                          <p className="text-xs text-[#6B7280] pt-1">
                            Sanitization in progress.
                          </p>
                        )}

                        {bed.status === 'maintenance' && (
                          <p className="text-xs text-rose-600 pt-1">
                            Maintenance scheduled.
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] font-medium text-[#6B7280]">
                        <span>${bed.dailyRate}/day</span>
                        <span className="text-[#111111] hover:underline">Update →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bed Status Update & Patient Admission Modal */}
        {activeBedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className="fixed inset-0"
              onClick={() => setActiveBedModal(null)}
            />
            <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl border border-[#EAEAEA] p-6 z-10 space-y-5">
              <div className="flex items-start justify-between border-b border-[#EAEAEA] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#111111]">
                    Bed {activeBedModal.bedNumber} ({activeBedModal.roomNumber})
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Floor {activeBedModal.floor} • Type: {activeBedModal.type} • Rate: ${activeBedModal.dailyRate}/day
                  </p>
                </div>
                <button
                  onClick={() => setActiveBedModal(null)}
                  className="p-1 rounded-md text-[#6B7280] hover:text-[#111111]"
                >
                  ✕
                </button>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-2">
                  Change Bed State:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['available', 'occupied', 'reserved', 'cleaning', 'maintenance'] as BedStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSaveBedStatus(st)}
                      className={`p-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                        activeBedModal.status === st
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#EAEAEA] hover:border-zinc-300 text-[#111111]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Intake Form if admitting */}
              <div className="pt-2 border-t border-[#EAEAEA] space-y-3">
                <h4 className="text-xs font-semibold text-[#111111]">
                  Admit Patient to Bed
                </h4>
                <div>
                  <label className="block text-xs text-[#6B7280] mb-1">Select Patient</label>
                  <select
                    value={admitPatientId}
                    onChange={(e) => setAdmitPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111]"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.mrn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#6B7280] mb-1">Attending Physician</label>
                  <input
                    type="text"
                    value={admitDoctorName}
                    onChange={(e) => setAdmitDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveBedStatus('occupied')}
                  className="w-full py-2 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Confirm Admission
                </button>
              </div>

              {activeBedModal.status === 'occupied' && (
                <div className="pt-2 border-t border-[#EAEAEA]">
                  <button
                    type="button"
                    onClick={() => {
                      dischargeBed(activeBedModal.id);
                      setActiveBedModal(null);
                    }}
                    className="w-full py-2 rounded-lg border border-[#EAEAEA] bg-white hover:bg-zinc-50 text-[#111111] font-medium text-xs transition-colors"
                  >
                    Discharge Patient & Mark for Cleaning
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Users,
  Calendar,
  Stethoscope,
  BedDouble,
  DollarSign,
  Syringe,
  Pill,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const APPOINTMENT_TREND = [
  { day: 'Mon', appointments: 42, completed: 38 },
  { day: 'Tue', appointments: 56, completed: 51 },
  { day: 'Wed', appointments: 68, completed: 62 },
  { day: 'Thu', appointments: 52, completed: 48 },
  { day: 'Fri', appointments: 74, completed: 69 },
  { day: 'Sat', appointments: 35, completed: 33 },
  { day: 'Sun', appointments: 22, completed: 21 },
];

const REVENUE_DATA = [
  { month: 'May', inpatient: 140000, outpatient: 85000, pharmacy: 42000 },
  { month: 'Jun', inpatient: 165000, outpatient: 92000, pharmacy: 48000 },
  { month: 'Jul', inpatient: 180000, outpatient: 104000, pharmacy: 53000 },
  { month: 'Aug', inpatient: 195000, outpatient: 110000, pharmacy: 58000 },
  { month: 'Sep', inpatient: 210000, outpatient: 118000, pharmacy: 64000 },
  { month: 'Oct (Proj)', inpatient: 225000, outpatient: 125000, pharmacy: 70000 },
];

const BED_OCCUPANCY_DATA = [
  { name: 'Occupied', value: 68, color: '#111111' },
  { name: 'Available', value: 24, color: '#10b981' },
  { name: 'Cleaning', value: 5, color: '#9ca3af' },
  { name: 'Maintenance', value: 3, color: '#ef4444' },
];

export default function AdminDashboardPage() {
  const { patients, doctors, appointments, rooms, invoices, medicines, labRequests, supportTickets } = useHospitalStore();
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');

  const totalBeds = rooms.reduce((acc, r) => acc + r.beds.length, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.beds.filter((b) => b.status === 'occupied').length, 0);
  const availableBeds = rooms.reduce((acc, r) => acc + r.beds.filter((b) => b.status === 'available').length, 0);

  const pendingBillsTotal = invoices
    .filter((i) => i.status === 'pending' || i.status === 'partially_paid')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  const lowStockCount = medicines.filter((m) => m.status === 'low_stock' || m.status === 'out_of_stock').length;
  const pendingLabsCount = labRequests.filter((l) => l.status !== 'completed').length;
  const openTicketsCount = supportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header with Greetings & Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Good morning, Admin. Here is the operational summary for today.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-white border border-[#EAEAEA] self-start sm:self-auto">
            {(['today', 'yesterday', 'week', 'month'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  dateFilter === filter
                    ? 'bg-[#111111] text-white'
                    : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Clean White KPI Cards with subtle gray borders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="flex items-center justify-between text-[#6B7280] text-xs">
              <span>Patients</span>
              <Users className="w-4 h-4 text-[#111111]" />
            </div>
            <p className="text-2xl font-bold text-[#111111] mt-2">{patients.length + 1248}</p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.5% this month
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="flex items-center justify-between text-[#6B7280] text-xs">
              <span>Doctors</span>
              <Stethoscope className="w-4 h-4 text-[#111111]" />
            </div>
            <p className="text-2xl font-bold text-[#111111] mt-2">{doctors.length}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">6 on duty now</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="flex items-center justify-between text-[#6B7280] text-xs">
              <span>Appointments</span>
              <Calendar className="w-4 h-4 text-[#111111]" />
            </div>
            <p className="text-2xl font-bold text-[#111111] mt-2">{appointments.length + 86}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">14 scheduled today</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="flex items-center justify-between text-[#6B7280] text-xs">
              <span>Admissions</span>
              <BedDouble className="w-4 h-4 text-[#111111]" />
            </div>
            <p className="text-2xl font-bold text-[#111111] mt-2">
              {occupiedBeds}/{totalBeds}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">{availableBeds} beds open</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="flex items-center justify-between text-[#6B7280] text-xs">
              <span>Pending Bills</span>
              <DollarSign className="w-4 h-4 text-[#111111]" />
            </div>
            <p className="text-2xl font-bold text-[#111111] mt-2">
              ${pendingBillsTotal.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#6B7280] mt-1">3 outstanding</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="flex items-center justify-between text-[#6B7280] text-xs">
              <span>Pending Labs</span>
              <Syringe className="w-4 h-4 text-[#111111]" />
            </div>
            <p className="text-2xl font-bold text-[#111111] mt-2">{pendingLabsCount}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">1 STAT priority</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Consultation Volume (Minimal Area Chart) */}
          <div className="lg:col-span-8 p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">
                  Weekly Consultation Volume
                </h3>
                <p className="text-xs text-[#6B7280]">Scheduled vs Completed patient appointments</p>
              </div>
              <span className="text-xs font-medium text-[#111111] bg-[#F8F8F8] px-2.5 py-1 rounded-md border border-[#EAEAEA]">
                Avg: 54 / day
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={APPOINTMENT_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EAEAEA',
                      color: '#111111',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="appointments" stroke="#111111" strokeWidth={2} fillOpacity={0.06} fill="#111111" name="Scheduled" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fillOpacity={0.06} fill="#10b981" name="Completed" />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bed Occupancy Breakdown */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#111111]">
                Bed Occupancy Status
              </h3>
              <p className="text-xs text-[#6B7280]">Live census across all hospital wards</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BED_OCCUPANCY_DATA}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {BED_OCCUPANCY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EAEAEA',
                      color: '#111111',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {BED_OCCUPANCY_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#6B7280]">{item.name}:</span>
                  <strong className="text-[#111111]">{item.value}%</strong>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EAEAEA]">
              <Link
                href="/admin/beds"
                className="w-full py-2 rounded-lg bg-white border border-[#EAEAEA] hover:bg-zinc-50 text-[#111111] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <BedDouble className="w-3.5 h-3.5" />
                Manage Beds
              </Link>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#111111]">
                Revenue by Service Line
              </h3>
              <p className="text-xs text-[#6B7280]">Inpatient vs Outpatient vs Pharmacy</p>
            </div>
            <Link
              href="/admin/billing"
              className="text-xs font-medium text-[#111111] hover:underline"
            >
              View Billing Hub →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #EAEAEA',
                    color: '#111111',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Bar dataKey="inpatient" fill="#111111" radius={[4, 4, 0, 0]} name="Inpatient Care" />
                <Bar dataKey="outpatient" fill="#6B7280" radius={[4, 4, 0, 0]} name="Outpatient Clinics" />
                <Bar dataKey="pharmacy" fill="#D1D5DB" radius={[4, 4, 0, 0]} name="Pharmacy Sales" />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Recent Activity in White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="font-semibold text-xs text-[#111111]">Pharmacy Stock Warnings</h4>
              </div>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                {lowStockCount} below threshold
              </span>
            </div>
            <div className="space-y-2">
              {medicines
                .filter((m) => m.status === 'low_stock' || m.status === 'out_of_stock')
                .map((m) => (
                  <div key={m.id} className="p-3 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-[#111111]">{m.name}</p>
                      <p className="text-[11px] text-[#6B7280]">Rack: {m.locationRack} • Batch: {m.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-rose-600">{m.quantityInStock} remaining</span>
                      <p className="text-[10px] text-[#9CA3AF]">Min: {m.minStockLevel}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#111111]" />
                <h4 className="font-semibold text-xs text-[#111111]">Active Support Tickets</h4>
              </div>
              <span className="text-[11px] font-medium text-[#111111] bg-[#F8F8F8] border border-[#EAEAEA] px-2 py-0.5 rounded-md">
                {openTicketsCount} open
              </span>
            </div>
            <div className="space-y-2">
              {supportTickets.slice(0, 2).map((t) => (
                <div key={t.id} className="p-3 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-[#111111]">{t.ticketNumber}: {t.subject}</p>
                    <p className="text-[11px] text-[#6B7280]">Patient: {t.patientName} • Category: {t.category}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

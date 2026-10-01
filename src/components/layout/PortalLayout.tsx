'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationBell } from './NotificationBell';
import { GlobalSearch } from './GlobalSearch';
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  BedDouble,
  Pill,
  Syringe,
  CreditCard,
  FileText,
  BarChart3,
  HelpCircle,
  Cpu,
  Settings,
  ShieldCheck,
  Clock,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck,
  Home,
  User,
  Activity,
  UserPlus,
} from 'lucide-react';

interface PortalLayoutProps {
  children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useHospitalStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Define role-specific navigation menus
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'admin':
      case 'super_admin':
        return [
          { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Patients', href: '/admin/patients', icon: Users },
          { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
          { label: 'Staff Directory', href: '/admin/staff', icon: UserCheck },
          { label: 'Departments', href: '/admin/departments', icon: Activity },
          { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
          { label: 'Rooms & Beds', href: '/admin/beds', icon: BedDouble },
          { label: 'Pharmacy', href: '/admin/pharmacy', icon: Pill },
          { label: 'Laboratory', href: '/admin/laboratory', icon: Syringe },
          { label: 'Billing & Invoices', href: '/admin/billing', icon: CreditCard },
          { label: 'Insurance Claims', href: '/admin/insurance', icon: ShieldCheck },
          { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
          { label: 'Support Tickets', href: '/admin/support', icon: HelpCircle },
          { label: 'AI Agent Monitor', href: '/admin/ai-monitoring', icon: Cpu },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
          { label: 'Roles & Access', href: '/admin/roles', icon: ShieldCheck },
        ];

      case 'doctor':
        return [
          { label: 'Doctor Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
          { label: 'My Schedule', href: '/doctor/schedule', icon: Clock },
          { label: 'Appointments Queue', href: '/doctor/appointments', icon: Calendar },
          { label: 'My Patients', href: '/doctor/patients', icon: Users },
          { label: 'Prescriptions', href: '/doctor/prescriptions', icon: Pill },
          { label: 'Lab Orders', href: '/doctor/lab-requests', icon: Syringe },
          { label: 'Clinical Notes', href: '/doctor/notes', icon: FileText },
          { label: 'Notifications', href: '/doctor/notifications', icon: HelpCircle },
        ];

      case 'patient':
        return [
          { label: 'Patient Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
          { label: 'My Appointments', href: '/patient/appointments', icon: Calendar },
          { label: 'Doctors Directory', href: '/patient/doctors', icon: Stethoscope },
          { label: 'Medical Records', href: '/patient/medical-records', icon: FileText },
          { label: 'My Prescriptions', href: '/patient/prescriptions', icon: Pill },
          { label: 'Lab Test Reports', href: '/patient/lab-reports', icon: Syringe },
          { label: 'Billing & Pay', href: '/patient/billing', icon: CreditCard },
          { label: 'Notifications', href: '/patient/notifications', icon: HelpCircle },
          { label: 'Help & Support', href: '/patient/support', icon: HelpCircle },
          { label: 'AI Health Assistant', href: '/patient/ai-assistant', icon: Cpu },
          { label: 'My Profile', href: '/patient/profile', icon: User },
        ];

      case 'receptionist':
        return [
          { label: 'Reception Desk', href: '/receptionist/dashboard', icon: LayoutDashboard },
          { label: 'Walk-in Register', href: '/receptionist/registration', icon: UserPlus },
          { label: 'Check-In Triage', href: '/receptionist/checkin', icon: Calendar },
          { label: 'Doctor Availability', href: '/receptionist/availability', icon: Clock },
        ];

      case 'lab_staff':
        return [
          { label: 'Lab Diagnostics', href: '/laboratory/dashboard', icon: LayoutDashboard },
          { label: 'Test Requests', href: '/laboratory/tests', icon: Syringe },
        ];

      case 'pharmacy_staff':
        return [
          { label: 'Dispensary', href: '/pharmacy/dashboard', icon: LayoutDashboard },
          { label: 'Medicine Inventory', href: '/pharmacy/inventory', icon: Pill },
          { label: 'Dispense Orders', href: '/pharmacy/dispense', icon: FileText },
        ];

      default:
        return [
          { label: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
          { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex bg-[#F8F8F8] text-[#111111]">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Strictly White background with subtle gray border */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#EAEAEA] transition-all duration-200 md:static ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#EAEAEA] shrink-0">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white shrink-0">
              <HeartPulse className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-sm tracking-tight text-[#111111] truncate block">
                  ApexCare
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6B7280] block -mt-1">
                  Health System
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-zinc-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3 bg-[#F8F8F8] border-b border-[#EAEAEA]">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-[#EAEAEA] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#111111] truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-[#6B7280] capitalize truncate">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items List - Active item is very light gray background + black text */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F8F8F8] text-[#111111] font-semibold border border-[#EAEAEA]'
                    : 'text-[#6B7280] hover:text-[#111111] hover:bg-zinc-50'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <ItemIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#111111]' : 'text-[#6B7280]'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#EAEAEA] space-y-1 shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#6B7280] hover:text-[#111111] hover:bg-zinc-50 transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Public Homepage"
          >
            <Home className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Public Website</span>}
          </Link>
          <Link
            href="/auth/login"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F8F8]">
        {/* Topbar - Clean White Background */}
        <header className="h-16 bg-white border-b border-[#EAEAEA] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-zinc-100"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-[#6B7280]">Portal / </span>
              <span className="text-xs font-semibold text-[#111111] capitalize">
                {pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalSearch />
            <RoleSwitcher />
            <NotificationBell />

            {/* Quick Profile Link */}
            <Link
              href="/patient/profile"
              className="flex items-center gap-2 pl-2 border-l border-[#EAEAEA]"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-[#EAEAEA]"
              />
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { RoleSwitcher } from './RoleSwitcher';
import { GlobalSearch } from './GlobalSearch';
import { UserRole } from '@/types';
import {
  HeartPulse,
  Menu,
  X,
  PhoneCall,
  Calendar,
  LayoutDashboard,
  ShieldAlert,
  Shield,
  Stethoscope,
  HeartHandshake,
  Syringe,
  Pill,
  User,
  ChevronRight,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Departments', href: '/departments' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Services', href: '/services' },
  { name: 'Facilities', href: '/facilities' },
  { name: 'Emergency', href: '/emergency', isEmergency: true },
  { name: 'Contact', href: '/contact' },
];

const MOBILE_ROLES: { role: UserRole; shortLabel: string; icon: any; path: string }[] = [
  { role: 'admin', shortLabel: 'Admin', icon: Shield, path: '/admin/dashboard' },
  { role: 'doctor', shortLabel: 'Doctor', icon: Stethoscope, path: '/doctor/dashboard' },
  { role: 'patient', shortLabel: 'Patient', icon: User, path: '/patient/dashboard' },
  { role: 'receptionist', shortLabel: 'Reception', icon: HeartHandshake, path: '/receptionist/dashboard' },
  { role: 'lab_staff', shortLabel: 'Lab', icon: Syringe, path: '/laboratory/dashboard' },
  { role: 'pharmacy_staff', shortLabel: 'Pharmacy', icon: Pill, path: '/pharmacy/dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole } = useHospitalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPortalUrl = () => {
    switch (currentUser.role) {
      case 'admin':
      case 'super_admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'receptionist':
        return '/receptionist/dashboard';
      case 'lab_staff':
        return '/laboratory/dashboard';
      case 'pharmacy_staff':
        return '/pharmacy/dashboard';
      default:
        return '/patient/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#EAEAEA]">
      {/* Top Emergency & Contact Triage Ribbon (Desktop Only) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 bg-[#F8F8F8] text-[#6B7280] text-xs font-medium border-b border-[#EAEAEA]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            24/7 Level 1 Emergency: +1 (555) 911-APEX
          </span>
          <span className="text-[#EAEAEA]">|</span>
          <span>Main Hospital: 800 Medical Center Parkway, Chicago, IL</span>
        </div>
        <div className="flex items-center gap-4 text-[#6B7280]">
          <span>JCI & NABH Accredited</span>
          <Link href="/emergency" className="text-[#111111] hover:underline font-medium">
            Emergency Guidelines →
          </Link>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-[#111111]">
              ApexCare
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-semibold text-[#6B7280] bg-[#F8F8F8] px-1.5 py-0.5 rounded border border-[#EAEAEA]">
              Hospital
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            if (link.isEmergency) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {link.name}
                </Link>
              );
            }
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#111111] bg-[#F8F8F8] font-semibold border border-[#EAEAEA]'
                    : 'text-[#6B7280] hover:text-[#111111] hover:bg-zinc-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Global Search Component */}
          <GlobalSearch />

          {/* Role Switcher (Visible on desktop/tablet) */}
          <RoleSwitcher />

          {/* Book Appointment CTA (Desktop only) */}
          <Link
            href="/book-appointment"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#111111] hover:bg-black text-white transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Visit
          </Link>

          {/* Portal button (Tablet and above) */}
          <Link
            href={getPortalUrl()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#EAEAEA] bg-white hover:bg-zinc-50 text-[#111111] transition-colors shadow-2xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden md:inline">Portal</span>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#111111] bg-[#F8F8F8] hover:bg-zinc-200 border border-[#EAEAEA] transition-colors focus-visible:ring-2 focus-visible:ring-[#111111]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu & Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-40 xl:hidden animate-in fade-in duration-150"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="mobile-menu"
            className="fixed inset-x-0 top-16 bg-white border-b border-[#EAEAEA] shadow-2xl z-50 px-4 sm:px-6 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-4 xl:hidden animate-in slide-in-from-top-2 duration-150"
          >
            {/* Mobile Active Persona & Switcher Selector */}
            <div className="p-3 bg-[#F8F8F8] rounded-xl border border-[#EAEAEA]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  Test Portal Perspective
                </span>
                <span className="text-[10px] font-bold text-[#111111] bg-white px-2 py-0.5 rounded border border-[#EAEAEA] capitalize">
                  Active: {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MOBILE_ROLES.map((r) => {
                  const isCurrent = currentUser.role === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setMobileMenuOpen(false);
                        router.push(r.path);
                      }}
                      className={`p-2 rounded-lg text-[11px] font-medium flex flex-col items-center gap-1 border transition-all ${
                        isCurrent
                          ? 'bg-[#111111] text-white border-[#111111] shadow-2xs font-semibold'
                          : 'bg-white text-[#6B7280] border-[#EAEAEA] hover:border-zinc-400 hover:text-[#111111]'
                      }`}
                    >
                      <r.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate w-full text-center">{r.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Links Grid */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider px-1">
                Explore ApexCare
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                        link.isEmergency
                          ? 'text-rose-600 bg-rose-50/80 border-rose-200 font-semibold'
                          : isActive
                          ? 'text-[#111111] bg-[#F8F8F8] font-bold border-[#111111]'
                          : 'text-[#6B7280] bg-white border-[#EAEAEA] hover:bg-zinc-50 hover:text-[#111111]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {link.isEmergency && <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                        <span className="truncate">{link.name}</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-2 border-t border-[#EAEAEA] space-y-2">
              <Link
                href="/book-appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#111111] text-white font-semibold text-xs text-center flex items-center justify-center gap-2 shadow-2xs hover:bg-black transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book An Appointment
              </Link>

              <Link
                href={getPortalUrl()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-white border border-[#EAEAEA] text-[#111111] font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Open Management Portal
              </Link>

              <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  +1 (555) 911-APEX
                </span>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-[#111111] hover:underline"
                >
                  Staff Sign In →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

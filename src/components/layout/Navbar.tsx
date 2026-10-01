'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { RoleSwitcher } from './RoleSwitcher';
import { GlobalSearch } from './GlobalSearch';
import {
  HeartPulse,
  Menu,
  X,
  PhoneCall,
  Calendar,
  LayoutDashboard,
  ShieldAlert,
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

export function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useHospitalStore();
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
      {/* Top Emergency & Contact Triage Ribbon */}
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

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[#111111] flex items-center gap-1.5">
              ApexCare
              <span className="text-[10px] uppercase font-semibold text-[#6B7280] bg-[#F8F8F8] px-1.5 py-0.5 rounded border border-[#EAEAEA]">
                Hospital
              </span>
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

        {/* Global Search & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <GlobalSearch />
          <RoleSwitcher />

          {/* Book Appointment CTA (Primary #111111 button) */}
          <Link
            href="/book-appointment"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#111111] hover:bg-black text-white transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Visit
          </Link>

          {/* Portal button (Secondary white button) */}
          <Link
            href={getPortalUrl()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[#EAEAEA] bg-white hover:bg-zinc-50 text-[#111111] transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden md:inline">Portal</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#6B7280] hover:bg-zinc-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#EAEAEA] px-6 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#EAEAEA]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-lg text-xs font-medium ${
                  link.isEmergency
                    ? 'text-rose-600 bg-rose-50 font-semibold flex items-center gap-1.5'
                    : pathname === link.href
                    ? 'text-[#111111] bg-[#F8F8F8] font-semibold border border-[#EAEAEA]'
                    : 'text-[#6B7280] hover:bg-zinc-50'
                }`}
              >
                {link.isEmergency && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 rounded-lg bg-[#111111] text-white font-medium text-xs text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book An Appointment
            </Link>
            <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#111111]" />
                Emergency: +1 (555) 911-APEX
              </span>
              <Link href="/auth/login" className="font-semibold text-[#111111] hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

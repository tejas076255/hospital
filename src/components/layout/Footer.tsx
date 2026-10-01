import Link from 'next/link';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Award, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-zinc-600 border-t border-zinc-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Accreditations */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-zinc-950 tracking-tight">
                ApexCare <span className="font-semibold text-zinc-500">Health</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              ApexCare Medical Center is an internationally recognized academic tertiary care institution dedicated to delivering quaternary clinical precision, innovative robotic surgery, and compassionate patient-centered healthcare.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-zinc-700">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" /> JCI Gold Seal Certified
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 font-medium">
                <Award className="w-3.5 h-3.5 text-zinc-900" /> Magnet Nursing Recognition
              </span>
            </div>
          </div>

          {/* Clinical Departments */}
          <div>
            <h4 className="text-sm font-bold text-zinc-950 mb-3">Departments</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/departments" className="hover:text-zinc-950 transition-colors">
                  Cardiology & Heart Center
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-zinc-950 transition-colors">
                  Neurology & Neurosurgery
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-zinc-950 transition-colors">
                  Orthopedics & Joint Care
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-zinc-950 transition-colors">
                  Pediatrics & Neonatal ICU
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-zinc-950 transition-colors">
                  Oncology & Cancer Care
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-rose-600 hover:text-rose-700 font-semibold">
                  24/7 Level 1 Trauma Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Hospital Links */}
          <div>
            <h4 className="text-sm font-bold text-zinc-950 mb-3">Patient Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/book-appointment" className="hover:text-zinc-950 transition-colors">
                  Schedule Consultation
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-zinc-950 transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/patient/medical-records" className="hover:text-zinc-950 transition-colors">
                  Access Health Records
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-zinc-950 transition-colors">
                  Virtual Campus Tour
                </Link>
              </li>
              <li>
                <Link href="/patient/billing" className="hover:text-zinc-950 transition-colors">
                  Pay Bill Online
                </Link>
              </li>
              <li>
                <Link href="/patient/support" className="hover:text-zinc-950 transition-colors">
                  Patient Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Emergency info */}
          <div>
            <h4 className="text-sm font-bold text-zinc-950 mb-3">24/7 Assistance</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>800 Medical Center Pkwy, Chicago, IL 60611</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Appointments: +1 (555) 234-CARE</span>
              </li>
              <li className="flex items-center gap-2 text-rose-600 font-semibold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Trauma Hotline: +1 (555) 911-APEX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>concierge@apexcare.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} ApexCare Medical System Inc. All rights reserved. HIPAA & HITECH Compliant.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-zinc-900">Privacy Policy</Link>
            <Link href="/about" className="hover:text-zinc-900">Terms of Clinical Care</Link>
            <Link href="/about" className="hover:text-zinc-900">Nondiscrimination Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

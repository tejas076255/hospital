'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHospitalStore } from '@/lib/data/store';
import { UserRole } from '@/types';
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Stethoscope,
  User,
  HeartHandshake,
  Syringe,
  Pill,
  CheckCircle2,
} from 'lucide-react';

const QUICK_DEMO_USERS: { email: string; role: UserRole; name: string; icon: any; color: string }[] = [
  { email: 'admin@apexcare.com', role: 'admin', name: 'Elena Rostova (Hospital Admin)', icon: Shield, color: 'text-indigo-500' },
  { email: 'dr.jenkins@apexcare.com', role: 'doctor', name: 'Dr. Sarah Jenkins (Cardiologist)', icon: Stethoscope, color: 'text-sky-500' },
  { email: 'james.wilson@gmail.com', role: 'patient', name: 'James Wilson (Registered Patient)', icon: User, color: 'text-emerald-500' },
  { email: 'david.reception@apexcare.com', role: 'receptionist', name: 'David Miller (Receptionist)', icon: HeartHandshake, color: 'text-amber-500' },
  { email: 'rachel.lab@apexcare.com', role: 'lab_staff', name: 'Dr. Rachel Gomez (Pathology Lab)', icon: Syringe, color: 'text-purple-500' },
  { email: 'sean.pharma@apexcare.com', role: 'pharmacy_staff', name: 'Sean Cooper (Pharmacist)', icon: Pill, color: 'text-rose-500' },
];

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, setCurrentUser, users } = useHospitalStore();

  const [email, setEmail] = useState('admin@apexcare.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        setCurrentUser(match);
        redirectToDashboard(match.role);
      } else {
        // Fallback default admin
        switchRole('admin');
        router.push('/admin/dashboard');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (demo: (typeof QUICK_DEMO_USERS)[0]) => {
    setEmail(demo.email);
    setPassword('demoPass123');
    const match = users.find((u) => u.role === demo.role);
    if (match) {
      setCurrentUser(match);
    } else {
      switchRole(demo.role);
    }
    redirectToDashboard(demo.role);
  };

  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        router.push('/admin/dashboard');
        break;
      case 'doctor':
        router.push('/doctor/dashboard');
        break;
      case 'patient':
        router.push('/patient/dashboard');
        break;
      case 'receptionist':
        router.push('/receptionist/dashboard');
        break;
      case 'lab_staff':
        router.push('/laboratory/dashboard');
        break;
      case 'pharmacy_staff':
        router.push('/pharmacy/dashboard');
        break;
      default:
        router.push('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-zinc-950 tracking-tight">
            ApexCare <span className="text-zinc-500 font-medium">Enterprise</span>
          </span>
        </Link>
        <p className="text-xs text-zinc-500">
          Hospital Information System • Role-Based Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Hospital Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@apexcare.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-zinc-600 hover:text-zinc-950 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Fast Demo Login Matrix */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                1-Click Quick Demo Sign-In
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Ready to test</span>
            </div>

            <div className="space-y-1.5">
              {QUICK_DEMO_USERS.map((demo) => {
                const ItemIcon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleQuickLogin(demo)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 flex items-center justify-between text-left text-xs transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon className="w-4 h-4 text-zinc-700 group-hover:text-zinc-950" />
                      <span className="font-semibold text-zinc-800 group-hover:text-zinc-950">
                        {demo.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-900 font-medium">Sign in →</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-zinc-500">
            New patient?{' '}
            <Link href="/auth/register" className="font-bold text-zinc-950 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

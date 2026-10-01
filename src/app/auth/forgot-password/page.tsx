'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F8F8]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white">
            <HeartPulse className="w-4 h-4" />
          </div>
          <span className="font-bold text-xl text-[#111111] tracking-tight">
            ApexCare <span className="font-normal text-[#6B7280]">Security</span>
          </span>
        </Link>
        <p className="text-xs text-[#6B7280]">
          Reset password for your clinical staff or patient account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EAEAEA] space-y-5">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111111]">Reset Link Dispatched</h3>
              <p className="text-xs text-[#6B7280]">
                If an account exists for <strong>{email}</strong>, a secure password reset link has been dispatched with a 15-minute token validity.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111] hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@apexcare.com"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                Send Password Reset Email
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className="text-xs text-[#6B7280] hover:text-[#111111]"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

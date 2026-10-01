'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useHospitalStore } from '@/lib/data/store';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function ContactPage() {
  const { createSupportTicket } = useHospitalStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiry',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupportTicket({
      patientName: form.name,
      patientEmail: form.email,
      subject: `Web Contact: ${form.subject || form.department}`,
      category: 'General',
      priority: 'medium',
      description: `Phone: ${form.phone}\nDept: ${form.department}\n\nMessage:\n${form.message}`,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight mt-1">
              Contact ApexCare Medical Center
            </h1>
            <p className="text-base text-zinc-600 mt-4 leading-relaxed">
              We are here to assist with physician referrals, international patient care, electronic health record requests, and general campus navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-zinc-900" />
                  Main Campus
                </h3>
                <div className="space-y-3 text-xs text-zinc-600">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span>800 Medical Center Parkway, Chicago, IL 60611</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>General Switchboard: +1 (555) 234-5000</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Emergency Trauma: +1 (555) 911-APEX</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>concierge@apexcare.com</span>
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-900" />
                  Visiting Hours & Parking
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  General Inpatient Wards: 08:00 AM - 08:00 PM daily. ICU Visiting Hours: 11:00 AM - 01:00 PM and 05:00 PM - 07:00 PM.
                </p>
                <p className="text-xs text-zinc-500">
                  Complimentary valet parking for patients at Main Pavilion Entrance 1.
                </p>
              </div>
            </div>

            {/* Interactive Inquiry Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950">Message Transmitted</h3>
                  <p className="text-xs text-zinc-600 max-w-md mx-auto">
                    Thank you. A hospital clinical concierge has been dispatched your inquiry and will follow up within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', department: 'General Inquiry', subject: '', message: '' });
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-950 hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-zinc-950">
                    Submit an Administrative or Clinical Inquiry
                  </h3>
                  <p className="text-xs text-zinc-500">
                    For medical emergencies, please do not use this web form; call +1 (555) 911-APEX directly.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Robert Martin"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. robert@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Department
                      </label>
                      <select
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                      >
                        <option>General Inquiry</option>
                        <option>Cardiology Center</option>
                        <option>Neurology & Neurosurgery</option>
                        <option>Orthopedics & Joint</option>
                        <option>Oncology Services</option>
                        <option>Patient Billing & Insurance</option>
                        <option>Medical Records Department</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Summary of inquiry"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please describe how we can assist you..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Contact Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

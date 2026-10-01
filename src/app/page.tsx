'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useHospitalStore } from '@/lib/data/store';
import {
  HeartPulse,
  Calendar,
  Stethoscope,
  ArrowRight,
  Activity,
  CheckCircle2,
  ChevronDown,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const { doctors, departments } = useHospitalStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I book an in-person or telemedicine consultation?',
      a: 'You can book directly using our online booking wizard, call our central scheduling line at +1 (555) 234-CARE, or simply ask our ApexCare AI Clinical Assistant in the bottom right corner.',
    },
    {
      q: 'What insurance networks does ApexCare accept?',
      a: 'We accept BlueCross BlueShield, UnitedHealthcare, Medicare, Aetna, Cigna, Humana, and Medicaid. Our patient billing coordinators can verify your coverage in advance.',
    },
    {
      q: 'What should I do in an emergency?',
      a: 'Our Level 1 Trauma Center and emergency resuscitation suites are open 24/7/365 at the Ground Level Emergency Bay. You can call the trauma hotline directly at +1 (555) 911-APEX.',
    },
    {
      q: 'How can I access my diagnostic lab results and prescriptions?',
      a: 'Registered patients can log into the ApexCare Patient Portal to view certified pathology reports, download printable prescriptions, and message their primary care physician.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white py-14 sm:py-20 border-b border-[#EAEAEA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                  <span>JCI Accredited Quaternary Academic Hospital</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.15]">
                  Advanced Healthcare,{' '}
                  <span className="underline decoration-[#EAEAEA] underline-offset-6">
                    Designed Around You.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl leading-relaxed">
                  Experience clinical excellence powered by recognized specialists, robotic surgical suites, and 24/7 hospital assistance.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book an Appointment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#EAEAEA] hover:bg-zinc-50 text-[#111111] font-medium text-xs transition-colors"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-[#111111]" />
                    Find a Doctor
                  </Link>
                </div>

                {/* Trust Metrics */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#EAEAEA]">
                  <div>
                    <p className="text-2xl font-bold text-[#111111]">99.4%</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Patient Satisfaction</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#111111]">180+</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Board-Certified MDs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#111111]">&lt; 8 min</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Emergency Triage Time</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-xl overflow-hidden border border-[#EAEAEA] bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80"
                    alt="ApexCare Hospital Facility"
                    className="w-full h-80 object-cover"
                  />

                  {/* Floating Live Emergency Stats Card */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-lg bg-white/95 border border-[#EAEAEA] shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#111111]">Level 1 Trauma Center</p>
                          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Trauma Team Ready • Helipad Active
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/emergency"
                        className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors"
                      >
                        Trauma Bay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIALTY DEPARTMENTS */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#EAEAEA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
                  Medical Departments
                </h2>
                <p className="text-xs text-[#6B7280] mt-1 max-w-xl">
                  Specialized clinical divisions equipped with modern surgical suites and intensive care units.
                </p>
              </div>
              <Link
                href="/departments"
                className="mt-3 md:mt-0 text-xs font-medium text-[#111111] hover:underline flex items-center gap-1"
              >
                Explore all departments →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.slice(0, 6).map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-xl p-5 bg-white border border-[#EAEAEA] hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-[#F8F8F8] text-[#111111] border border-[#EAEAEA]">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-[#6B7280] bg-[#F8F8F8] px-2 py-0.5 rounded-md border border-[#EAEAEA]">
                      {dept.code}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#111111]">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#6B7280]">
                    <span>{dept.activeDoctorsCount} Specialists</span>
                    <span className="text-emerald-700 font-medium">{dept.availableBedsCount} Beds Open</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED DOCTORS */}
        <section className="py-14 sm:py-18 bg-[#F8F8F8] border-b border-[#EAEAEA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
                  Meet Our Lead Physicians
                </h2>
                <p className="text-xs text-[#6B7280] mt-1 max-w-xl">
                  Fellowship-trained medical leaders committed to providing compassionate patient care.
                </p>
              </div>
              <Link
                href="/doctors"
                className="mt-3 md:mt-0 text-xs font-medium text-[#111111] hover:underline flex items-center gap-1"
              >
                View all physicians →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl bg-white border border-[#EAEAEA] overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.fullName}
                        className="w-12 h-12 rounded-lg object-cover border border-[#EAEAEA] shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-xs text-[#111111] truncate">
                          {doc.fullName}
                        </h3>
                        <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                          {doc.specialization}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF] truncate mt-0.5">
                          {doc.qualification}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-semibold text-[#111111]">
                            {doc.rating}
                          </span>
                          <span className="text-[10px] text-[#9CA3AF]">
                            ({doc.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7280] mt-3 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
                      <span className="text-[#6B7280]">Consultation Fee</span>
                      <span className="font-semibold text-[#111111]">${doc.consultationFee}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F8F8] border-t border-[#EAEAEA] flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Available: {doc.availableDays[0]}
                    </span>
                    <Link
                      href={`/book-appointment?doctor=${doc.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US & FACILITIES */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#EAEAEA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                  Hospital Facilities & Standards
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  From modern surgical theaters to automated pathology and diagnostic imaging, ApexCare provides clinical accuracy and patient safety.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#111111]">
                        Robotic Operating Theaters
                      </h4>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        Intra-operative imaging with sub-millimeter navigation and precision.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#111111]">
                        Level IV Intensive Care Units
                      </h4>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        High-frequency monitoring and dedicated subspecialty life support.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#111111]">
                        Automated Clinical Pathology
                      </h4>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        Rapid turnaround for routine blood chemistry and specialized assays.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/facilities"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111] hover:underline"
                  >
                    View medical facilities →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-3">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80"
                  alt="Neurosurgery Suite"
                  className="rounded-xl h-52 w-full object-cover border border-[#EAEAEA]"
                />
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80"
                  alt="Pediatric Intensive Care"
                  className="rounded-xl h-52 w-full object-cover border border-[#EAEAEA] mt-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-14 sm:py-18 bg-[#F8F8F8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Common questions about appointments, insurance, and emergency services.</p>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white border border-[#EAEAEA] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs text-[#111111]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9CA3AF] transition-transform ${
                        openFaq === idx ? 'rotate-180 text-[#111111]' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-[#6B7280] leading-relaxed border-t border-[#EAEAEA] pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

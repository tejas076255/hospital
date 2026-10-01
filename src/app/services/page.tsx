import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { HeartPulse, Stethoscope, BedDouble, Activity, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    title: 'Inpatient Quaternary Care',
    desc: '650-bed inpatient capacity featuring private suites, dedicated clinical nurse specialists, telemetry monitoring, and nutritional therapy.',
    icon: BedDouble,
    highlights: ['24/7 Intensivist Care', 'Private & Semi-Private Suites', 'Post-Op Accelerated Recovery'],
  },
  {
    title: 'Cardiothoracic Surgery & Catheterization',
    desc: 'Minimally invasive coronary interventions, TAVR, open-heart revascularization, and electrophysiological ablation.',
    icon: HeartPulse,
    highlights: ['Bi-plane Hybrid Cath Lab', 'Robotic Bypass Grafting', 'Transcatheter Heart Valve Program'],
  },
  {
    title: 'Robotic & Minimally Invasive Surgery',
    desc: 'State-of-the-art da Vinci Xi and MAKO robotic platforms for oncologic resections, prostatectomy, and joint replacement.',
    icon: Cpu,
    highlights: ['Sub-millimeter Surgical Precision', 'Minimal Blood Loss', 'Shorter Hospitalization'],
  },
  {
    title: '24/7 Level 1 Trauma & Emergency',
    desc: 'Full resuscitation bays, immediate neurosurgical standby, rapid-infusion blood banks, and rooftop emergency air helipad.',
    icon: ShieldAlert,
    highlights: ['Dedicated Trauma Surgery Bay', 'Direct Helipad Access', 'Sub-8min Emergency Triage'],
  },
  {
    title: 'Diagnostic Radiology & Molecular Pathology',
    desc: 'High-field 3.0 Tesla MRI, 128-slice dual-energy CT, digital 3D mammography, and same-day certified blood analysis.',
    icon: Activity,
    highlights: ['Next-Gen DNA Tumor Sequencing', 'Instant AI Scan Assist', 'Full Body PET-CT'],
  },
  {
    title: 'Outpatient Telemedicine & Chronic Care',
    desc: 'Seamless virtual physician visits, remote blood pressure/glucose tracking, and electronic prescription refills.',
    icon: Stethoscope,
    highlights: ['Encrypted HD Telehealth', 'Same-Day Digital Pharmacy', 'Specialist Second Opinions'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Clinical Offerings
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight mt-1">
              Comprehensive Medical & Surgical Services
            </h1>
            <p className="text-base text-zinc-600 mt-4 leading-relaxed">
              From preventative family medicine to the most complex neurovascular surgeries, ApexCare provides a continuum of certified care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv, idx) => {
              const SrvIcon = srv.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-zinc-100 text-zinc-950 w-fit border border-zinc-200">
                      <SrvIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-950">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {srv.desc}
                    </p>

                    <div className="pt-2 space-y-1.5">
                      {srv.highlights.map((h, i) => (
                        <p key={i} className="text-xs text-zinc-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                          {h}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-100">
                    <Link
                      href="/book-appointment"
                      className="text-xs font-semibold text-zinc-950 hover:underline flex items-center gap-1.5"
                    >
                      Book Consultation <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

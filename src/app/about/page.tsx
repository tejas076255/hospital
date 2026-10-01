import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              Pioneering Clinical Medicine for Over 40 Years.
            </h1>
            <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
              Founded in 1984, ApexCare Medical Center has grown from a regional hospital into an acclaimed 650-bed quaternary academic healthcare network, setting clinical benchmarks across cardiovascular surgery, robotic neurosurgery, and oncology genomics.
            </p>
          </div>

          {/* Pillars in White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-3">
              <div className="p-2.5 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] w-fit">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Our Mission</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                To advance the health and wellbeing of humanity through relentless clinical precision, world-class biomedical research, and compassionate patient advocacy.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-3">
              <div className="p-2.5 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Accreditations</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Joint Commission International (JCI) Gold Seal of Approval, American College of Surgeons Comprehensive Cancer Center, and Magnet Recognition for Nursing Excellence.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-3">
              <div className="p-2.5 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] w-fit">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Clinical Innovation</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Pioneers in AI-assisted cardiology triage, robotic spinal arthroplasty, and targeted chimeric antigen receptor (CAR) T-cell therapies.
              </p>
            </div>
          </div>

          {/* Hospital Leadership & Stats - White Card with Subtle Border */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EAEAEA]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-[#111111]">650+</p>
                <p className="text-xs text-[#6B7280] mt-1">Inpatient Capacity</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#111111]">42,000+</p>
                <p className="text-xs text-[#6B7280] mt-1">Annual Surgeries</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#111111]">180+</p>
                <p className="text-xs text-[#6B7280] mt-1">Specialist Physicians</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#111111]">100%</p>
                <p className="text-xs text-[#6B7280] mt-1">Electronic Health Records</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

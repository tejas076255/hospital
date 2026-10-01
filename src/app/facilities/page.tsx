import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const FACILITIES = [
  {
    title: 'Hybrid Robotic Operating Theaters',
    desc: 'Featuring Siemens Artis pheno robotic imaging consoles paired with dual da Vinci Xi surgical systems for real-time 3D fluoroscopy during complex vascular and spine surgeries.',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    specs: ['Air exchanges: 30/hr HEPA', 'Sub-millimeter navigation', 'Integrated telemetry'],
  },
  {
    title: 'Level IV Neonatal Intensive Care (NICU)',
    desc: 'Equipped with sound-attenuated private pods, radiant warmers, continuous cerebral function monitoring (aEEG), and family kangaroo-care support suites.',
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    specs: ['30 Private Critical Pods', 'Bedside Nitric Oxide', '24/7 Neonatologist on-site'],
  },
  {
    title: 'Advanced Diagnostic Imaging Suite',
    desc: 'Houses 3.0 Tesla wide-bore MRI with silent scan technology, 128-slice spectral CT, and robotic biplane digital angiography suites.',
    img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    specs: ['3.0 Tesla High-Field MRI', 'Ultra-Low Radiation CT', 'AI-assisted reconstruction'],
  },
  {
    title: 'Quaternary Inpatient Executive Suites',
    desc: 'Designed for optimal patient healing, featuring private family lounges, ergonomic patient beds, medical-grade climate filtration, and smart room automation.',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    specs: ['Smart vital monitoring', 'Private en-suite bath', 'Acoustic soundproofing'],
  },
];

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Infrastructure
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight mt-1">
              World-Class Hospital Facilities
            </h1>
            <p className="text-base text-zinc-600 mt-4 leading-relaxed">
              Engineered to meet the stringent international specifications of Joint Commission International (JCI), prioritizing clinical safety, rapid infection control, and patient comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FACILITIES.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-300 transition-all duration-300"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/20 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-bold text-sm bg-black/60 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/20">
                    {f.title}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {f.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {f.specs.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 border border-zinc-200 text-zinc-800"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

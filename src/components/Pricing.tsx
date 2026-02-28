import { motion } from "motion/react";
import { Check, Info, Users, Hotel, PlaneTakeoff, Utensils, Droplets, Briefcase, ArrowRight } from "lucide-react";

const pricingData = [
  { group: "Min. 2 orang", quad: "—", triple: "—", twin: "Rp 27.300.000" },
  { group: "Min. 3 orang", quad: "—", triple: "Rp 24.500.000", twin: "Rp 26.200.000" },
  { group: "Min. 4 orang", quad: "Rp 23.100.000", triple: "Rp 23.900.000", twin: "Rp 25.500.000" },
  { group: "Min. 5 orang", quad: "Rp 22.800.000", triple: "Rp 23.600.000", twin: "Rp 25.200.000" },
  { group: "Min. 6 orang", quad: "Rp 22.100.000", triple: "Rp 23.300.000", twin: "Rp 25.000.000", best: true },
];

const included = [
  { text: "Tiket pesawat PP ekonomi (CGK–JED–CGK)", icon: <PlaneTakeoff size={18} /> },
  { text: "Visa Umroh + Asuransi + Siskopatuh", icon: <Info size={18} /> },
  { text: "Hotel Makkah & Madinah (Bintang 3)", icon: <Hotel size={18} /> },
  { text: "Makan Full Board Sesuai Program", icon: <Utensils size={18} /> },
  { text: "Pendampingan Muthawwif 1x Umroh", icon: <Users size={18} /> },
  { text: "Airport Handling & Zam-zam (5L)", icon: <Briefcase size={18} /> },
];

export default function Pricing() {
  return (
    <section id="harga" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center lg:text-left">
          <div className="eyebrow text-primary mb-4">PRICING</div>
          <h2 className="heading-hero">
            One <span className="heading-underscore">subscription,</span> <br />
            <span className="text-italics">endless</span> possibilities.
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl">
            Semakin Ramai, Semakin Ringan di Kantong. Program 9 Hari Periode 10 Juni – 15 Agustus 2026.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Main Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 card-premium bg-ink text-white p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-4xl font-display font-bold mb-2">Umroh Mandiri</h3>
                <p className="text-white/60">PAUSE OR CANCEL ANYTIME</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-display font-black text-accent">Rp 22.1jt</div>
                <div className="text-white/40 font-mono text-xs uppercase tracking-widest">Starting Price</div>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <div className="grid grid-cols-4 pb-4 border-b border-white/10 text-xs font-black uppercase tracking-widest text-white/40">
                <div>Jamaah</div>
                <div>Quad</div>
                <div>Triple</div>
                <div>Twin</div>
              </div>
              {pricingData.map((row, i) => (
                <div key={i} className={`grid grid-cols-4 items-center py-2 transition-colors ${row.best ? 'text-accent' : 'text-white/80'}`}>
                  <div className="font-bold">{row.group.replace('Min. ', '')}</div>
                  <div className="font-mono text-sm">{row.quad}</div>
                  <div className="font-mono text-sm">{row.triple}</div>
                  <div className="font-mono text-sm font-bold">{row.twin}</div>
                </div>
              ))}
            </div>

            <a href="https://wa.me/yournumber" className="w-full bg-white text-ink py-6 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-accent transition-all group">
              Join today
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>

          {/* Features Column */}
          <div className="lg:col-span-2 space-y-12">
             <div className="card-premium">
                <h4 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Check size={18} />
                  </div>
                  What's Included
                </h4>
                <ul className="space-y-5">
                  {included.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-ink-muted font-medium">
                      <span className="text-primary">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-surface border border-line">
                   <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-ink flex-shrink-0">
                      <Users size={20} />
                   </div>
                   <div>
                      <h5 className="font-bold mb-1">Ajak Teman, Hemat Bersama</h5>
                      <p className="text-sm text-ink-muted">Semakin banyak orang, biaya sewa kamar & transportasi dibagi lebih banyak.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-surface border border-line">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <Droplets size={20} />
                   </div>
                   <div>
                      <h5 className="font-bold mb-1">Ibadah Sesuai Ritme</h5>
                      <p className="text-sm text-ink-muted">Bebas mengatur waktu ibadah sendiri tanpa terikat jadwal rombongan besar.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

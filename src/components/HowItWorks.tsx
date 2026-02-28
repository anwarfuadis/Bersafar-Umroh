import { motion } from "motion/react";
import { Search, MessageSquare, Plane, ShieldCheck, Heart, ArrowRight, MessageCircle } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Pilih paket & hitung kelompokmu",
    description: "Semakin banyak yang berangkat, semakin hemat per orangnya. Cek tabel harga dan tentukan tipe kamar yang paling cocok.",
    icon: <Search size={28} />,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "02",
    title: "Konfirmasi via WhatsApp",
    description: "Hubungi tim Bersafar. Kita ngobrol dulu soal jadwal, dokumen, dan kebutuhan khusus. Pastikan paspor berlaku min. 7 bulan.",
    icon: <MessageSquare size={28} />,
    color: "bg-accent/20 text-ink",
  },
  {
    id: "03",
    title: "Berangkat dari Soetta",
    description: "Tim handling menyambut di Bandara Soekarno-Hatta. Urusan check-in dan bagasi beres tanpa ribet.",
    icon: <Plane size={28} />,
    color: "bg-ink/5 text-ink",
  },
  {
    id: "04",
    title: "Ibadah mandiri, bantuan selalu ada",
    description: "Di Makkah dan Madinah, PIC lokal siap 24/7 via WA untuk apa saja — dari transportasi sampai ziarah.",
    icon: <ShieldCheck size={28} />,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "05",
    title: "Pulang dengan hati yang tenang",
    description: "Konfirmasi transfer Madinah → Jeddah sehari sebelumnya. Semoga umroh kita diterima. Amin.",
    icon: <Heart size={28} />,
    color: "bg-accent/20 text-ink",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="heading-hero">
            The way umroh <br />
            <span className="text-italics">should’ve</span> been done.
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl">
            Dari Niat sampai Pulang, Bersafar Menemanimu dengan 5 langkah yang mudah, jelas, dan tidak ribet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-premium group"
            >
              <div className={`w-16 h-16 ${step.color} rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {step.icon}
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-ink/20">{step.id}</span>
                <div className="h-[1px] flex-grow bg-line" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-ink-muted leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
          
          {/* Final Call Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="card-premium bg-ink text-white flex flex-col justify-center items-center text-center group"
          >
             <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={32} className="text-accent" />
             </div>
             <h3 className="text-2xl font-display font-bold mb-4">Punya pertanyaan?</h3>
             <p className="text-white/60 mb-8">Tim kami siap ngobrol kapan saja via WhatsApp.</p>
             <a href="https://wa.me/yournumber" className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Tanya Bersafar <ArrowRight size={18} />
             </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

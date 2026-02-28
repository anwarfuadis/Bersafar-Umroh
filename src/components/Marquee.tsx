import { motion } from "motion/react";

const items = [
  "Tiket Pesawat PP",
  "Visa Umroh",
  "Asuransi Perjalanan",
  "Hotel Bintang 3",
  "Makan Full Board",
  "Transfer Bandara",
  "Muthawwif Profesional",
  "Zam-zam 5 Liter",
  "Handling Soetta",
  "PIC 24/7",
];

export default function Marquee() {
  return (
    <div className="bg-ink py-10 border-y border-white/5 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-3xl md:text-4xl font-display font-black text-white/20 uppercase tracking-tighter">
                {item}
              </span>
              <div className="w-3 h-3 bg-accent rounded-full" />
            </div>
          ))}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-3xl md:text-4xl font-display font-black text-white/20 uppercase tracking-tighter">
                {item}
              </span>
              <div className="w-3 h-3 bg-accent rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Yang enggak termasuk apa aja?",
    answer: (
      <span>
        Biaya pembuatan paspor, pengeluaran pribadi (laundry, telepon, belanja), kelebihan bagasi, dan <strong>transportasi Makkah-Madinah</strong> (jika tidak mengambil paket full).
      </span>
    ),
  },
  {
    question: "Yang udah termasuk apa aja?",
    answer: "Tiket PP, visa, asuransi, hotel bintang 3, makan 3x sehari, sampai air zam-zam.",
  },
  {
    question: "Cuma bedua, bisa berangkat kah?",
    answer: "Bisa banget. Mau berangkat berdua saja sama pasangan atau teman tetap bisa. Tidak perlu tunggu rombongan besar kumpul dulu.",
  },
  {
    question: "Gimana biar dapet harga murah?",
    answer: (
      <div className="space-y-3">
        <p>Harga kami menggunakan sistem kuota progresif. Semakin banyak jamaah yang bergabung di tanggal yang sama, biaya per orang akan otomatis turun karena efisiensi biaya kamar dan operasional.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Quad:</strong> Diskon mulai 5 - 6 orang</li>
          <li><strong>Triple:</strong> Diskon mulai 4 - 6 orang</li>
          <li><strong>Twin:</strong> Diskon mulai 3 - 6 orang</li>
        </ul>
        <p>Ajak keluarga atau sahabat untuk bergabung di grup yang sama agar bisa menikmati harga maksimal (diskon hingga 6 orang).</p>
      </div>
    ),
  },
  {
    question: "Itinerary 9 hari apa aja?",
    answer: (
      <div className="space-y-4">
        {[
          { day: "Hari 01", activity: "Jakarta – Jeddah – Makkah (Handling SOETA, Umroh)" },
          { day: "Hari 02-04", activity: "Makkah - Mandiri (Free time, Optional Tour Thaif)" },
          { day: "Hari 05", activity: "Makkah – Madinah (Transfer ke Madinah)" },
          { day: "Hari 06-07", activity: "Madinah - Mandiri (Free time, Nabawi)" },
          { day: "Hari 08", activity: "Madinah – Jeddah (Transfer ke Bandara JED)" },
          { day: "Hari 09", activity: "Jakarta (Tiba di SOETA)" },
        ].map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <span className="font-bold text-primary whitespace-nowrap text-sm">{item.day}</span>
            <span className="text-sm">{item.activity}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    question: "Gimana kalo bawa anak?",
    answer: (
      <div className="space-y-2">
        <p><strong>Anak (diatas 2 tahun):</strong> Dikenakan biaya penuh (full price) karena sudah menggunakan seat pesawat dan bed hotel sendiri.</p>
        <p><strong>Bayi (dibawah 2 tahun):</strong> Dikenakan biaya flat Rp 7.000.000. Biaya ini mencakup tiket pesawat infant (biasanya 50% harga dewasa tergantung maskapai) dan asuransi, namun tidak mendapatkan seat sendiri di pesawat maupun bed di hotel.</p>
      </div>
    ),
  },
  {
    question: "kalo butuh bantuan di sana gimana?",
    answer: "Begitu mendarat, langsung kabari tim kami di Jeddah. Mobil jemputan sudah siap antar kamu langsung ke hotel di Makkah.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="heading-hero">FAQ</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card-premium !p-0 overflow-hidden">
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between group transition-colors hover:bg-slate-50"
              >
                <span className="font-display font-bold text-lg group-hover:text-primary transition-colors">{faq.question}</span>
                <div className={`w-8 h-8 rounded-full border border-line flex items-center justify-center shrink-0 transition-all duration-300 ${activeIndex === i ? 'bg-ink text-white rotate-180' : 'bg-white text-ink group-hover:border-ink'}`}>
                  <ChevronDown size={16} />
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-sm text-ink-muted leading-relaxed border-t border-line/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "motion/react";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="section-padding bg-ink text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black font-display">ب</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-hero mb-8">
              See if Bersafar is the <br />
              <span className="text-italics text-accent">right fit</span> for you.
            </h2>
            <p className="text-2xl text-white/60 mb-12 leading-tight">
              Schedule a quick, 15 minute guided tour through Bersafar. Cerita ke kami dulu — tanpa tekanan, tanpa buru-buru.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="https://wa.me/yournumber"
                className="bg-white text-ink px-10 py-6 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-accent transition-all group"
              >
                <MessageCircle size={24} />
                Book a call
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">Prefer to email?</p>
                <a href="mailto:hello@bersafar.com" className="text-lg font-bold hover:text-accent transition-colors">hello@bersafar.com</a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-surface bg-white/5 border-white/10 p-12 rounded-[48px] text-center">
               <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-accent/20">
                  <MessageCircle size={40} className="text-ink" />
               </div>
               <h3 className="text-3xl font-display font-bold mb-4">Start today</h3>
               <p className="text-white/40 mb-10">One subscription to rule them all. Pause or cancel anytime.</p>
               <div className="h-[1px] bg-white/10 w-full mb-10" />
               <div className="flex justify-center gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center font-bold text-xs">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

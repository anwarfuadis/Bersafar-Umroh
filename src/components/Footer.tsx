import { MessageCircle, Instagram, Mail, ArrowRight } from "lucide-react";
import { Logo } from "./Navbar";

interface FooterProps {
  onNavigate: (page: "home" | "about") => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-ink text-white pt-32 pb-12 px-6 md:px-12 lg:px-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-12 h-12" iconClassName="w-8 h-8" variant="white" />
              <span className="font-display font-bold text-3xl tracking-tighter">Bersafar</span>
            </div>
            <p className="text-white/40 text-xl max-w-sm mb-10 leading-relaxed">
              Platform umroh mandiri yang bikin umroh mandiri jadi simple
            </p>
            <div className="flex gap-6">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1">
                <Instagram size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1">
                <MessageCircle size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1">
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-10">Navigasi</h4>
            <ul className="space-y-6 text-lg font-bold">
              <li><button onClick={() => onNavigate("home")} className="text-white/60 hover:text-white transition-colors">Beranda</button></li>
              <li><button onClick={() => onNavigate("about")} className="text-white/60 hover:text-white transition-colors">Tentang Kami</button></li>
              <li><a href="#faq" className="text-white/60 hover:text-white transition-colors">Pertanyaan Umum</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-10">Hubungi Kami</h4>
            <p className="text-white/60 text-lg mb-6 leading-tight">Nyari yang lain atau masih mau tanya tanya?</p>
            <a 
              href="https://wa.me/yournumber"
              className="inline-flex items-center gap-2 text-accent font-black text-xl hover:gap-4 transition-all"
            >
              WhatsApp Tim <ArrowRight size={24} />
            </a>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-bold text-white/20 uppercase tracking-widest">
          <p>© 2026 Bersafar Umroh Mandiri. Labbaik Allahumma Labbaik.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

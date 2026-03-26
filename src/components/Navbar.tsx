import { motion } from "motion/react";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export function Logo({ className = "w-10 h-10", iconClassName = "w-6 h-6", variant = "primary" }: { className?: string; iconClassName?: string; variant?: "primary" | "white" }) {
  return (
    <div className={`${className} ${variant === "white" ? "bg-white" : "bg-primary"} rounded-[1.2rem] flex items-center justify-center shadow-lg ${variant === "white" ? "shadow-white/10" : "shadow-primary/20"}`}>
      <svg viewBox="0 0 100 100" className={`${iconClassName} ${variant === "white" ? "fill-ink" : "fill-accent"}`}>
        <path d="M20 45 Q20 65 50 65 Q80 65 80 45 L80 40 L70 40 L70 45 Q70 55 50 55 Q30 55 30 45 L30 40 L20 40 Z" />
        <path d="M50 75 L42 85 L58 85 Z" />
      </svg>
    </div>
  );
}

interface NavbarProps {
  onOpenAuth: (mode: "login" | "register") => void;
  isLoggedIn: boolean;
  onNavigate: (page: "home" | "about") => void;
  currentPage: "home" | "about";
}

export default function Navbar({ onOpenAuth, isLoggedIn, onNavigate, currentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-6"}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className={`flex items-center justify-between bg-white/80 backdrop-blur-md transition-all duration-500 border border-line shadow-sm ${scrolled ? "px-6 py-2 rounded-full" : "px-8 py-4 rounded-full"}`}>
          {/* Logo */}
          <div 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Logo className={`transition-all duration-500 ${scrolled ? "w-8 h-8" : "w-10 h-10"}`} iconClassName={scrolled ? "w-5 h-5" : "w-6 h-6"} />
            <span className={`font-display font-bold tracking-tighter text-ink transition-all duration-500 ${scrolled ? "text-xl" : "text-2xl"}`}>
              Bersafar<span className="text-accent">.</span>
            </span>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => onNavigate("home")}
              className={`font-bold transition-all hover:text-primary ${currentPage === "home" ? "text-primary" : "text-ink/60"}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => onNavigate("about")}
              className={`font-bold transition-all hover:text-primary ${currentPage === "about" ? "text-primary" : "text-ink/60"}`}
            >
              Tentang Kami
            </button>
          </div>

          {/* Right CTA - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <button className={`rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-primary/20 ${scrolled ? "w-10 h-10" : "w-12 h-12"}`}>
                <User size={scrolled ? 18 : 20} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onOpenAuth("login")}
                  className={`font-bold hover:text-primary transition-all ${scrolled ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"}`}
                >
                  Masuk
                </button>
                <button 
                  onClick={() => onOpenAuth("register")}
                  className={`bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 ${scrolled ? "px-6 py-2 text-sm" : "px-8 py-3 text-base"}`}
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-ink p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-24 left-6 right-6 bg-white rounded-[32px] p-8 flex flex-col gap-4 shadow-2xl border border-line"
        >
          <div className="flex flex-col gap-2 mb-4">
            <button 
              onClick={() => {
                onNavigate("home");
                setIsOpen(false);
              }}
              className={`text-left py-3 font-bold ${currentPage === "home" ? "text-primary" : "text-ink"}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => {
                onNavigate("about");
                setIsOpen(false);
              }}
              className={`text-left py-3 font-bold ${currentPage === "about" ? "text-primary" : "text-ink"}`}
            >
              Tentang Kami
            </button>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={24} />
              </div>
              <div>
                <div className="font-bold text-ink">Profile Saya</div>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth("login");
                }}
                className="w-full py-4 border-2 border-line rounded-2xl font-bold text-ink"
              >
                Masuk
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth("register");
                }}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20"
              >
                Daftar Sekarang
              </button>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}

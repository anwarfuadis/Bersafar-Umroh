import { motion, AnimatePresence } from "motion/react";
import { X, Phone, Lock, User, ArrowRight } from "lucide-react";
import { useState, FormEvent } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = "login", onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">(initialMode);
  const [gender, setGender] = useState<"laki-laki" | "perempuan" | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate auth success
    onSuccess?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold mb-2">
                  {mode === "login" ? "Selamat Datang" : mode === "register" ? "Buat Akun" : "Lupa Password"}
                </h2>
                <p className="text-ink-muted">
                  {mode === "login" 
                    ? "Masuk untuk melanjutkan perjalananmu." 
                    : mode === "register"
                    ? "Daftar untuk mulai merencanakan Umroh Mandiri."
                    : "Masukkan nomor WhatsApp kamu untuk reset password."}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === "forgot-password" ? (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
                    <input 
                      type="tel" 
                      placeholder="Nomor WhatsApp"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ) : (
                  <>
                    {mode === "register" && (
                      <>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
                          <input 
                            type="text" 
                            placeholder="Nama Lengkap"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setGender("laki-laki")}
                            className={`py-4 rounded-2xl border-2 font-bold transition-all ${gender === "laki-laki" ? "border-primary bg-primary/5 text-primary" : "border-line text-ink/40 hover:border-ink/20"}`}
                          >
                            Brother
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender("perempuan")}
                            className={`py-4 rounded-2xl border-2 font-bold transition-all ${gender === "perempuan" ? "border-primary bg-primary/5 text-primary" : "border-line text-ink/40 hover:border-ink/20"}`}
                          >
                            Sister
                          </button>
                        </div>
                      </>
                    )}
                    
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
                      <input 
                        type="tel" 
                        placeholder="Nomor WhatsApp"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
                      <input 
                        type="password" 
                        placeholder="Password"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {mode === "login" && (
                      <div className="flex justify-end px-1">
                        <button 
                          type="button"
                          onClick={() => setMode("forgot-password")}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Lupa password?
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button className="w-full py-5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 group">
                  {mode === "login" ? "Masuk" : mode === "register" ? "Daftar Sekarang" : "Kirim Link Reset"}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-ink-muted">
                  {mode === "forgot-password" ? (
                    <button 
                      onClick={() => setMode("login")}
                      className="text-primary font-bold hover:underline"
                    >
                      Kembali ke Masuk
                    </button>
                  ) : (
                    <>
                      {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                      <button 
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                        className="text-primary font-bold hover:underline"
                      >
                        {mode === "login" ? "Daftar" : "Masuk"}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, ArrowRight, ArrowDown, Calendar, Check, X, Settings, Info, Users, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

// ════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════

const SLOTS = [
  { 
    date: '2026-06-10', 
    label: '10 Jun 2026', 
    jamCount: 14, 
    rooms: { 
      quad: { avail: 6, total: 8, joined: { m: 1, f: 1 } }, 
      triple: { avail: 3, total: 6, joined: { m: 2, f: 1 } }, 
      twin: { avail: 1, total: 4, joined: { m: 1, f: 2 } } 
    } 
  },
  { 
    date: '2026-06-17', 
    label: '17 Jun 2026', 
    jamCount: 8, 
    rooms: { 
      quad: { avail: 10, total: 12, joined: { m: 1, f: 1 } }, 
      triple: { avail: 5, total: 6, joined: { m: 1, f: 0 } }, 
      twin: { avail: 2, total: 4, joined: { m: 2, f: 2 } } 
    } 
  },
  { 
    date: '2026-06-24', 
    label: '24 Jun 2026', 
    jamCount: 0, 
    rooms: { 
      quad: { avail: 12, total: 12, joined: { m: 0, f: 0 } }, 
      triple: { avail: 6, total: 6, joined: { m: 0, f: 0 } }, 
      twin: { avail: 4, total: 4, joined: { m: 0, f: 0 } } 
    } 
  },
  { 
    date: '2026-07-01', 
    label: '1 Jul 2026', 
    jamCount: 19, 
    rooms: { 
      quad: { avail: 2, total: 8, joined: { m: 3, f: 3 } }, 
      triple: { avail: 0, total: 6, joined: { m: 3, f: 3 } }, 
      twin: { avail: 1, total: 4, joined: { m: 3, f: 4 } } 
    } 
  },
];

const PRICE: Record<number, Record<string, number | null>> = {
  2: { quad: 23100000, triple: 24500000, twin: 27300000 },
  3: { quad: 23100000, triple: 24500000, twin: 26200000 },
  4: { quad: 23100000, triple: 23900000, twin: 25500000 },
  5: { quad: 22800000, triple: 23600000, twin: 25200000 },
  6: { quad: 22100000, triple: 23300000, twin: 25000000 },
};

const getPriceTier = (n: number) => {
  if (n >= 6) return 6;
  if (n >= 5) return 5;
  if (n >= 4) return 4;
  if (n >= 3) return 3;
  return 2;
};

const fmtPrice = (n: number | null) => {
  if (!n) return '–';
  return 'Rp\u00A0' + (n / 1000000).toFixed(1).replace('.0', '') + '\u00A0Jt';
};

const MONTHS = [
  { year: 2026, month: 5, name: 'Juni 2026' },
  { year: 2026, month: 6, name: 'Juli 2026' },
  { year: 2026, month: 7, name: 'Agustus 2026' },
];

export default function Hero({ onOpenAuth, isLoggedIn }: { onOpenAuth: (mode: "login" | "register") => void; isLoggedIn: boolean }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<typeof SLOTS[0] | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<'quad' | 'triple' | 'twin' | null>(null);
  const [seatCount, setSeatCount] = useState(1);
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'include' | 'exclude'>('include');
  const [showPricingInfo, setShowPricingInfo] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const currentPrice = useMemo(() => {
    if (!selectedDate || !selectedRoom) return null;
    const totalJamaah = selectedDate.jamCount + seatCount;
    const tier = getPriceTier(totalJamaah);
    return PRICE[tier][selectedRoom];
  }, [selectedDate, selectedRoom, seatCount]);

  const originalPrice = useMemo(() => {
    if (!selectedRoom) return null;
    return PRICE[2][selectedRoom] || PRICE[3][selectedRoom] || null;
  }, [selectedRoom]);

  const handleDateSelect = (dateKey: string) => {
    const slot = SLOTS.find(s => s.date === dateKey);
    if (slot) {
      setSelectedDate(slot as any);
    } else {
      const [y, m, d] = dateKey.split('-').map(Number);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
      setSelectedDate({
        date: dateKey,
        label: `${d} ${monthNames[m - 1]} ${y}`,
        jamCount: 0,
        rooms: {
          quad: { avail: 12, total: 12, joined: { m: 0, f: 0 } },
          triple: { avail: 6, total: 6, joined: { m: 0, f: 0 } },
          twin: { avail: 4, total: 4, joined: { m: 0, f: 0 } },
        }
      } as any);
    }
  };

  const renderCalendar = () => {
    const mo = MONTHS[currentMonthIdx];
    const firstDay = new Date(mo.year, mo.month, 1).getDay();
    const daysInMonth = new Date(mo.year, mo.month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${mo.year}-${String(mo.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSlot = SLOTS.some(s => s.date === dateKey);
      const isSelected = selectedDate?.date === dateKey;
      const dateObj = new Date(mo.year, mo.month, d);
      const minDate = new Date(2026, 5, 10);
      const maxDate = new Date(2026, 7, 15);
      const outRange = dateObj < minDate || dateObj > maxDate;

      days.push(
        <button
          key={dateKey}
          disabled={outRange}
          onClick={() => handleDateSelect(dateKey)}
          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all relative border-2
            ${outRange ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:bg-gold/10 hover:border-gold/30'}
            ${isSelected ? 'bg-primary text-white border-primary shadow-lg' : 'border-transparent'}
            ${!isSelected && isSlot ? 'text-gold font-bold' : ''}
          `}
        >
          {d}
          {!isSelected && isSlot && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />}
        </button>
      );
    }

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg">{mo.name}</h3>
          <div className="flex gap-2">
            <button
              disabled={currentMonthIdx === 0}
              onClick={() => setCurrentMonthIdx(prev => prev - 1)}
              className="p-2 rounded-lg border border-line hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentMonthIdx === 2}
              onClick={() => setCurrentMonthIdx(prev => prev + 1)}
              className="p-2 rounded-lg border border-line hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
            <div key={d} className="text-[10px] font-black uppercase tracking-widest text-ink/30 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
        <div className="mt-8 pt-6 border-t border-line flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/40">
            <div className="w-2 h-2 rounded-full bg-gold" /> Grup Aktif
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/40">
            <div className="w-2 h-2 rounded-full border border-ink/20" /> Bisa Dipilih
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch pt-20 overflow-hidden bg-background">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-12 pb-6 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <div className="w-12 h-[2px] bg-accent" />
            <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">Bismillah</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 md:mb-12 text-ink">
            Pilih <span className="heading-underscore">tanggal.</span> <br />
            Kita cari <span className="text-endless">temen</span> <br />
            buat <span className="heading-underscore">berangkat.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-ink-muted max-w-xl mb-8 md:mb-12 leading-relaxed font-medium">
            Umroh peaceful, harga mindful. Mulai 2 orang bisa berangkat insya Allah
          </p>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className={`step-pip flex items-center gap-3 ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>
              <div className="step-pip-num">1</div>
              <span className="text-xs font-bold uppercase tracking-widest">Jadwal</span>
            </div>
            <div className={`h-[2px] w-8 ${step > 1 ? 'bg-gold' : 'bg-ink/10'}`} />
            <div className={`step-pip flex items-center gap-3 ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
              <div className="step-pip-num">2</div>
              <span className="text-xs font-bold uppercase tracking-widest">Grup</span>
            </div>
            <div className={`h-[2px] w-8 ${step > 2 ? 'bg-gold' : 'bg-ink/10'}`} />
            <div className={`step-pip flex items-center gap-3 ${step === 3 ? 'active' : ''}`}>
              <div className="step-pip-num">3</div>
              <span className="text-xs font-bold uppercase tracking-widest">Detail</span>
            </div>
          </div>

          {/* Stats removed */}
        </motion.div>
      </div>

      {/* Right Interactive Panel */}
      <div className="flex-1 relative min-h-0 lg:min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="absolute inset-0 bg-primary lg:rounded-l-[120px] overflow-hidden -z-10">
           <div className="absolute inset-0 opacity-5 select-none pointer-events-none flex items-center justify-center">
              <div className="text-[20vw] font-display font-black text-white tracking-tighter leading-none rotate-90 lg:rotate-0">
                BERSAFAR
              </div>
           </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-line"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-8 pb-0 flex justify-between items-center">
                  <h2 className="text-xl font-display font-bold">Pilih Tanggal Keberangkatan</h2>
                  <div className="px-4 py-1 bg-gold/10 border border-gold/30 rounded-full text-[10px] font-black text-gold uppercase tracking-widest">
                    9 Slot Tersedia
                  </div>
                </div>
                {renderCalendar()}
                <div className="p-8 pt-0 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="w-full sm:w-auto">
                    <div className="text-lg font-display font-bold text-ink">
                      {selectedDate ? selectedDate.label : 'Pilih tanggal dulu'}
                    </div>
                    {selectedDate && (
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                        {selectedDate.jamCount} Jamaah Bergabung, Insya Allah
                      </div>
                    )}
                    {!selectedDate && (
                      <div className="text-xs font-medium text-ink/40">
                        Klik tanggal yang tersedia
                      </div>
                    )}
                  </div>
                  <button
                    disabled={!selectedDate}
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-xl shadow-primary/20"
                  >
                    Lanjut
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 md:p-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-display font-bold">Pilih Tipe Kamar</h2>
                </div>

                <div className="flex items-center gap-4 bg-primary/5 p-3 rounded-2xl mb-4">
                  <Calendar size={18} className="text-primary" />
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold text-primary truncate">{selectedDate?.label} · 9 Hari PP</div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] font-black text-gold uppercase tracking-widest underline">Ganti</button>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-1 gap-3">
                    {(['quad', 'triple', 'twin'] as const).map(type => {
                      const roomData = (selectedDate?.rooms as any)?.[type];
                      const avail = roomData?.avail || 0;
                      const joined = roomData?.joined || { m: 0, f: 0 };
                      const totalJoined = joined.m + joined.f;
                      const isSoldOut = avail === 0;
                      const iconCount = type === 'quad' ? 4 : type === 'triple' ? 3 : 2;
                      const capacity = type === 'quad' ? 4 : type === 'triple' ? 3 : 2;
                      const isCapacityMet = totalJoined >= capacity;
                      
                      return (
                        <button
                          key={type}
                          disabled={isSoldOut}
                          onClick={() => {
                            setSelectedRoom(type);
                            setSeatCount(1);
                          }}
                          className={`relative p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left
                            ${isSoldOut ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer hover:border-gold'}
                            ${selectedRoom === type ? 'border-primary bg-primary/5' : 'border-line bg-background'}
                          `}
                        >
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center mb-0.5 gap-2">
                              <div className="text-sm font-bold capitalize truncate">{type} Room</div>
                              <div className="text-sm font-black text-primary whitespace-nowrap">
                                {isCapacityMet ? fmtPrice(PRICE[4][type] || PRICE[3][type]) : fmtPrice(PRICE[2][type] || PRICE[3][type])}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                                {totalJoined === 0 ? (
                                  <span className="text-gold">Belum ada jamaah</span>
                                ) : totalJoined >= capacity ? (
                                  <span className="text-primary">{totalJoined} bergabung, harga turun!</span>
                                ) : (
                                  <span>{totalJoined} bergabung, kurang {capacity - totalJoined}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {selectedRoom === type && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                              <Check size={14} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedRoom && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Pricing Mechanism Info */}
                    <div className="mb-4">
                      <button 
                        onClick={() => setShowPricingInfo(!showPricingInfo)}
                        className="w-full flex items-center justify-between p-3 bg-gold/5 border border-gold/20 rounded-2xl text-left hover:bg-gold/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Info size={16} className="text-gold" />
                          <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Skema Harga</span>
                        </div>
                        <ChevronDown size={16} className={`text-gold transition-transform ${showPricingInfo ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {showPricingInfo && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 mt-2 bg-slate-50 rounded-2xl border border-line text-[11px] leading-relaxed text-ink/60 space-y-3">
                              <p>1. Minimal keberangkatan sesuai kapasitas kamar. Jika tidak ada tambahan jamaah, maka kami sarankan untuk upgrade.</p>
                              <p>2. Jika kuota melebihi kapasitas kamar, maka harga akan otomatis <strong>didiskon</strong>:</p>
                              <ul className="pl-4 space-y-1">
                                <li>- <strong>Quad:</strong> Diskon mulai 5 - 6 orang</li>
                                <li>- <strong>Triple:</strong> Diskon mulai 4 - 6 orang</li>
                                <li>- <strong>Twin:</strong> Diskon mulai 3 - 6 orang</li>
                              </ul>
                              <p>3. Harga maksimal diskon di 6 orang. Lebih dari 6 orang harga tetap sama.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mb-4 p-5 bg-slate-50 rounded-3xl border border-line">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-ink">Jumlah Jamaah</h4>
                          <p className="text-[9px] text-ink/40 font-bold uppercase tracking-widest">Bisa tambah seat untuk keluarga</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                            className="w-7 h-7 rounded-lg border border-line flex items-center justify-center bg-white hover:bg-slate-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="font-display font-bold text-lg w-4 text-center">{seatCount}</span>
                          <button 
                            onClick={() => setSeatCount(Math.min(10, seatCount + 1))}
                            className="w-7 h-7 rounded-lg border border-line flex items-center justify-center bg-white hover:bg-slate-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary p-6 rounded-3xl text-white mb-4 relative overflow-hidden">
                      <div className="flex items-baseline flex-wrap gap-x-4 gap-y-1">
                        <div className="text-3xl sm:text-4xl font-display font-black text-accent leading-none whitespace-nowrap">{fmtPrice(currentPrice)}</div>
                        <div className="text-xs font-medium text-white/40 whitespace-nowrap">per orang</div>
                      </div>
                      
                      {seatCount > 1 && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total ({seatCount} orang)</div>
                          <div className="text-xl font-display font-bold text-accent">{fmtPrice(currentPrice * seatCount)}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          if (!isLoggedIn) {
                            onOpenAuth("login");
                          } else {
                            setStep(3);
                          }
                        }} 
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-ink transition-all shadow-xl shadow-primary/20 group"
                      >
                        Lanjut ke Detail
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => setStep(1)} 
                        className="w-full py-4 rounded-2xl border-2 border-line font-bold text-ink/40 hover:text-ink hover:border-ink transition-all"
                      >
                        Kembali
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 md:p-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display font-bold">Ringkasan Pesanan</h2>
                  <div className="px-3 py-1 bg-accent/20 border border-accent/30 rounded-full text-xs font-black text-ink uppercase tracking-widest whitespace-nowrap">
                    9 Hari PP
                  </div>
                </div>

                <div className="bg-primary p-6 rounded-3xl text-white mb-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-white/40">Jadwal</span>
                      <span className="font-bold">{selectedDate?.label}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-white/40">Kamar</span>
                      <span className="font-bold capitalize">{selectedRoom} Room</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-white/40">Grup Saat Ini</span>
                      <span className="font-bold">{selectedDate?.jamCount} Jamaah</span>
                    </div>
                    {seatCount > 1 && (
                      <div className="flex justify-between text-base">
                        <span className="text-white/40">Jumlah Seat</span>
                        <span className="font-bold">{seatCount} Orang</span>
                      </div>
                    )}
                    <div className="h-[1px] bg-white/10 my-2" />
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-white/60 font-bold whitespace-nowrap text-sm">
                        {seatCount > 1 ? 'Harga Per Orang' : 'Total'}
                      </span>
                      <span className="text-2xl font-display font-black text-accent whitespace-nowrap">{fmtPrice(currentPrice)}</span>
                    </div>
                    {seatCount > 1 && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-white/60 font-bold whitespace-nowrap text-sm">Total Bayar</span>
                        <span className="text-3xl font-display font-black text-accent whitespace-nowrap">{fmtPrice(currentPrice * seatCount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 bg-background p-1 rounded-2xl mb-4">
                  {(['include', 'exclude'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                        ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-ink/30 hover:text-ink'}
                      `}
                    >
                      {tab === 'include' ? '✅ Termasuk' : '❌ Tidak'}
                    </button>
                  ))}
                </div>

                <div className="max-h-[200px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                  {activeTab === 'include' && (
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { icon: '✈️', text: 'Tiket Pesawat PP Ekonomi' },
                        { icon: '📋', text: 'Visa & Asuransi Perjalanan' },
                        { icon: '🏨', text: 'Hotel Bintang 3' },
                        { icon: '🍽️', text: 'Makan Full Board' },
                        { icon: '🚐', text: 'Transfer Bandara - Hotel' },
                        { icon: '🕌', text: 'Muthawwif 1x Umroh' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-xl text-sm font-bold">
                          <span className="text-xl">{item.icon}</span>
                          {item.text}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'exclude' && (
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { icon: '🚌', text: 'Transport Makkah → Madinah' },
                        { icon: '🌹', text: 'Tasreh Raudah' },
                        { icon: '👕', text: 'Perlengkapan Umroh' },
                        { icon: '💰', text: 'Kebutuhan Pribadi' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 rounded-xl text-sm font-bold text-red-900/60">
                          <span className="text-xl">{item.icon}</span>
                          {item.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setShowSuccess(true);
                      setShowItinerary(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-center flex items-center justify-center gap-3 hover:bg-ink transition-all shadow-xl shadow-primary/20 group"
                  >
                    Gabung
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full py-4 rounded-2xl border-2 border-line font-bold text-ink/40 hover:text-ink hover:border-ink transition-all"
                  >
                    Kembali
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-4xl">✨</div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-xl text-ink font-medium leading-relaxed">
                  Alhamdulillah, semoga Allah mudahkan umroh brother/sister fillah. Tim kami akan segera berkabar untuk langkah selanjutnya.
                </p>
              </div>

              {/* Expandable Itinerary */}
              <div className="mb-8 border border-line rounded-3xl overflow-hidden">
                <button 
                  onClick={() => setShowItinerary(!showItinerary)}
                  className="w-full flex items-center justify-between p-5 bg-background hover:bg-line/5 transition-colors"
                >
                  <span className="font-bold text-ink">Yuk intip Itinerary</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-ink/40 transition-transform duration-300 ${showItinerary ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {showItinerary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white"
                    >
                      <div className="p-5 space-y-4">
                        {[
                          { day: '01', title: 'Jakarta – Jeddah – Makkah', desc: 'Handling SOETA, Umroh' },
                          { day: '02-04', title: 'Makkah - Mandiri', desc: 'Free time, Optional Tour Thaif' },
                          { day: '05', title: 'Makkah – Madinah', desc: 'Transfer ke Madinah' },
                          { day: '06-07', title: 'Madinah - Mandiri', desc: 'Free time, Nabawi' },
                          { day: '08', title: 'Madinah – Jeddah', desc: 'Transfer ke Bandara JED' },
                          { day: '09', title: 'Jakarta', desc: 'Tiba di SOETA' }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4 items-center p-3 bg-background rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-black text-xs shrink-0">{item.day}</div>
                            <div>
                              <div className="text-sm font-bold text-ink">{item.title}</div>
                              <div className="text-[10px] font-medium text-ink/40 uppercase tracking-wider">{item.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  setStep(1);
                  setSelectedDate(null);
                  setSelectedRoom(null);
                  setSeatCount(1);
                }}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-ink transition-all shadow-lg shadow-primary/20"
              >
                OK, Bismillah.
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

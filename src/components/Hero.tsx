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
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'include' | 'exclude'>('include');
  const [showPricingInfo, setShowPricingInfo] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [travelerType, setTravelerType] = useState<'solo' | 'group' | null>(null);
  const [showExtraTravelers, setShowExtraTravelers] = useState(false);
  const [travelerCounts, setTravelerCounts] = useState({
    brother: 1,
    sister: 0,
    child: 0,
    infant: 0
  });

  const seatCount = useMemo(() => {
    if (travelerType === 'solo') return 1;
    return travelerCounts.brother + travelerCounts.sister + travelerCounts.child;
  }, [travelerType, travelerCounts]);

  const airlines = [
    { name: "Emirates", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg" },
    { name: "Etihad", logo: "https://upload.wikimedia.org/wikipedia/commons/0/03/Etihad_Airways_logo.svg" },
    { name: "Oman Air", logo: "https://upload.wikimedia.org/wikipedia/en/f/f8/Oman_Air_logo.svg" },
    { name: "Scoot", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Scoot_Logo.svg" },
    { name: "Air Asia", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/AirAsia_Logo.svg" },
    { name: "Lion Air", logo: "https://upload.wikimedia.org/wikipedia/en/2/2e/Lion_Air_logo.svg" },
    { name: "Fly Dubai", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Flydubai_logo.svg" },
  ];

  const currentPrice = useMemo(() => {
    if (!selectedDate || !selectedRoom) return null;
    const totalJamaah = selectedDate.jamCount + seatCount;
    const tier = getPriceTier(totalJamaah);
    return PRICE[tier][selectedRoom];
  }, [selectedDate, selectedRoom, seatCount]);

  const totalPrice = useMemo(() => {
    if (!currentPrice) return 0;
    const baseTotal = currentPrice * seatCount;
    const infantTotal = travelerCounts.infant * 7000000;
    return baseTotal + infantTotal;
  }, [currentPrice, seatCount, travelerCounts.infant]);

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
          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all relative border-2 touch-manipulation
            ${outRange ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:bg-gold/10 hover:border-gold/30'}
            ${isSelected ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10' : 'border-transparent'}
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
      </div>
    );
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch pt-20 overflow-hidden bg-background">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-20 relative z-10">
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

          {/* Stats removed */}
        </motion.div>
      </div>

      {/* Right Interactive Panel */}
      <div className="flex-1 relative min-h-0 lg:min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="absolute inset-0 bg-primary lg:rounded-l-[120px] overflow-hidden -z-10">
           <div className="absolute inset-0 opacity-5 select-none pointer-events-none flex items-center justify-center">
              <div className="text-[20vw] font-display font-black text-white tracking-tighter leading-none rotate-90 lg:rotate-0">
                BERSAFAR
              </div>
           </div>
        </div>

        <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-line relative z-20">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, pointerEvents: 'none' }}
                transition={{ duration: 0.3 }}
                className="relative pointer-events-auto"
              >
                <div className="p-8 pb-0">
                  <h2 className="text-xl font-display font-bold">Pilih Tanggal Berangkat</h2>
                </div>
                {renderCalendar()}
                <div className="p-8 pt-0 flex flex-col gap-8">
                  {selectedDate && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="h-[1px] bg-line" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-[10px] font-bold text-ink/70 uppercase tracking-widest">Siapa yang ikut umroh?</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setTravelerType('solo')}
                            className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 touch-manipulation ${travelerType === 'solo' ? 'border-primary bg-primary text-white' : 'border-line hover:border-primary/30 text-ink/60'}`}
                          >
                            {travelerType === 'solo' && <Check size={12} />}
                            <span className="text-[11px] font-bold">Saya sendiri</span>
                          </button>
                          <button 
                            onClick={() => setTravelerType('group')}
                            className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 touch-manipulation ${travelerType === 'group' ? 'border-primary bg-primary text-white' : 'border-line hover:border-primary/30 text-ink/60'}`}
                          >
                            {travelerType === 'group' && <Check size={12} />}
                            <span className="text-[11px] font-bold">Bareng keluarga</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-lg font-display font-bold text-ink truncate whitespace-nowrap">
                        {selectedDate ? selectedDate.label : 'Pilih tanggal'}
                      </div>
                      {selectedDate && (
                        <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                          {selectedDate.jamCount} Jamaah
                        </div>
                      )}
                      {!selectedDate && (
                        <div className="text-xs font-medium text-ink/40">
                          Klik tanggal yang tersedia
                        </div>
                      )}
                    </div>
                    <button
                      disabled={!selectedDate || !travelerType}
                      onClick={() => setStep(2)}
                      className="shrink-0 bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-lg shadow-primary/20"
                    >
                      Lanjut
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, pointerEvents: 'none' }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 relative pointer-events-auto"
              >
                <div className="flex items-center gap-3 mb-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h2 className="text-lg font-display font-bold">Pilih Tipe Kamar</h2>
                </div>

                <div className="flex items-center gap-4 bg-primary/5 p-3 rounded-2xl mb-4">
                  <Calendar size={18} className="text-primary" />
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold text-primary truncate">{selectedDate?.label}</div>
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
                      const target = type === 'quad' ? 5 : type === 'triple' ? 4 : 3;
                      const totalJamaah = (selectedDate?.jamCount || 0) + seatCount;
                      const isTargetHit = totalJamaah >= target;
                      
                      const tier = getPriceTier(totalJamaah);
                      const roomPrice = PRICE[tier][type];
                      const basePrice = PRICE[2][type] || PRICE[3][type];
                      const isDiscounted = (roomPrice || 0) < (basePrice || 0);
                      
                      return (
                        <button
                          key={type}
                          disabled={isSoldOut}
                          onClick={() => {
                            setSelectedRoom(type);
                          }}
                          className={`relative p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left min-h-[88px]
                            ${isSoldOut ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer hover:border-gold'}
                            ${selectedRoom === type ? 'border-primary bg-primary/5' : 'border-line bg-background'}
                          `}
                        >
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center mb-0.5 gap-2">
                              <div className="text-sm font-bold capitalize truncate">{type} Room</div>
                              <div className="text-right">
                                <div className="text-sm font-black text-primary whitespace-nowrap">
                                  {fmtPrice(roomPrice)}
                                </div>
                                {isDiscounted && (
                                  <div className="text-[10px] text-ink/30 line-through font-bold">
                                    {fmtPrice(basePrice)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                                {selectedDate?.jamCount === 0 ? (
                                  <span className="text-gold">Belum ada jamaah</span>
                                ) : isTargetHit ? (
                                  <span className="text-primary">{selectedDate?.jamCount} bergabung, harga turun!</span>
                                ) : (
                                  <span>{selectedDate?.jamCount} bergabung, kurang {target - totalJamaah}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {selectedRoom === type && (
                            <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                              <Check size={12} />
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
                        onClick={() => setShowPricingInfo(true)}
                        className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest hover:opacity-70 transition-opacity"
                      >
                        <Info size={14} />
                        Skema Harga
                      </button>
                      
                      <AnimatePresence>
                        {showPricingInfo && (
                          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative"
                            >
                              <button 
                                onClick={() => setShowPricingInfo(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                              >
                                <X size={20} />
                              </button>
                              <h3 className="text-xl font-display font-bold mb-6">Skema Harga</h3>
                              <div className="text-sm leading-relaxed text-ink/60 space-y-4">
                                <p>1. Minimal keberangkatan sesuai kapasitas kamar. Jika tidak ada tambahan jamaah, maka kami sarankan untuk upgrade.</p>
                                <p>2. Jika kuota melebihi kapasitas kamar, maka harga akan otomatis <strong>didiskon</strong>:</p>
                                <ul className="pl-4 space-y-2">
                                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-gold" /> <strong>Quad:</strong> Diskon mulai 5 - 6 orang</li>
                                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-gold" /> <strong>Triple:</strong> Diskon mulai 4 - 6 orang</li>
                                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-gold" /> <strong>Twin:</strong> Diskon mulai 3 - 6 orang</li>
                                </ul>
                                <p>3. Harga maksimal diskon di 6 orang. Lebih dari 6 orang harga tetap sama.</p>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {travelerType === 'group' && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-line space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[9px] font-bold text-ink/40 uppercase tracking-widest">Jumlah Jamaah</h4>
                        </div>
                        
                        <div className="space-y-2">
                          {[
                            { label: 'Brother', key: 'brother' },
                            { label: 'Sister', key: 'sister' },
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-ink">{item.label}</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setTravelerCounts(prev => ({ ...prev, [item.key]: Math.max(0, (prev as any)[item.key] - 1) }))}
                                  className="w-5 h-5 rounded-md border border-line flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-[10px] touch-manipulation"
                                >
                                  -
                                </button>
                                <span className="font-display font-bold text-xs w-3 text-center">{(travelerCounts as any)[item.key]}</span>
                                <button 
                                  onClick={() => setTravelerCounts(prev => ({ ...prev, [item.key]: (prev as any)[item.key] + 1 }))}
                                  className="w-5 h-5 rounded-md border border-line flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-[10px] touch-manipulation"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}

                          {!showExtraTravelers ? (
                            <button 
                              onClick={() => setShowExtraTravelers(true)}
                              className="w-full py-1.5 text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-primary/20 touch-manipulation"
                            >
                              + Tambah Anak / Bayi
                            </button>
                          ) : (
                            <div className="space-y-2 pt-2 border-t border-line/50">
                              {[
                                { label: 'Anak', key: 'child' },
                                { label: 'Bayi (< 2 thn)', key: 'infant' },
                              ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-ink">{item.label}</span>
                                    {item.label === 'Bayi (< 2 thn)' && (
                                      <div className="group relative inline-block">
                                        <Info size={12} className="text-ink/30 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ink text-[9px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                          Biaya flat Rp 7jt. Mencakup tiket infant & asuransi. Tidak mendapat seat pesawat & bed hotel.
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => setTravelerCounts(prev => ({ ...prev, [item.key]: Math.max(0, (prev as any)[item.key] - 1) }))}
                                      className="w-5 h-5 rounded-md border border-line flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-[10px] touch-manipulation"
                                    >
                                      -
                                    </button>
                                    <span className="font-display font-bold text-xs w-3 text-center">{(travelerCounts as any)[item.key]}</span>
                                    <button 
                                      onClick={() => setTravelerCounts(prev => ({ ...prev, [item.key]: (prev as any)[item.key] + 1 }))}
                                      className="w-5 h-5 rounded-md border border-line flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-[10px] touch-manipulation"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button 
                                onClick={() => setShowExtraTravelers(false)}
                                className="w-full py-1 text-[8px] font-bold text-ink/30 uppercase tracking-widest hover:text-ink/50 transition-colors touch-manipulation"
                              >
                                Sembunyikan
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-6 rounded-3xl border border-line mb-4 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                          Total ({seatCount} orang{travelerCounts.infant > 0 ? `, ${travelerCounts.infant} bayi` : ''})
                        </div>
                        <div className="text-2xl font-display font-black text-primary">{fmtPrice(totalPrice)}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        disabled={seatCount + travelerCounts.infant === 0}
                        onClick={() => {
                          if (!isLoggedIn) {
                            onOpenAuth("login");
                          } else {
                            setStep(3);
                          }
                        }} 
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-ink transition-all shadow-xl shadow-primary/20 group disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Lanjut ke Detail
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, pointerEvents: 'none' }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 relative pointer-events-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setStep(2)}
                      className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <h2 className="text-xl font-display font-bold">Ringkasan Pesanan</h2>
                  </div>
                </div>

                <div className="bg-primary p-4 rounded-2xl text-white mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Jadwal</span>
                      <span className="font-bold">{selectedDate?.label}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Kamar</span>
                      <span className="font-bold capitalize">{selectedRoom} Room</span>
                    </div>
                    {(seatCount > 1 || travelerCounts.infant > 0) && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Jumlah Jamaah</span>
                        <span className="font-bold">
                          {seatCount} Orang
                          {travelerCounts.infant > 0 && ` + ${travelerCounts.infant} Bayi`}
                        </span>
                      </div>
                    )}
                    <div className="h-[1px] bg-white/10 my-1" />
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-white/60 font-bold whitespace-nowrap text-[10px] uppercase tracking-wider">Total Bayar</span>
                      <span className="text-2xl font-display font-black text-accent whitespace-nowrap">{fmtPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {(['include', 'exclude'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${activeTab === tab ? 'border-primary bg-primary text-white' : 'border-line hover:border-primary/30 text-ink/60'}`}
                    >
                      {activeTab === tab && (tab === 'include' ? <Check size={12} /> : <X size={12} />)}
                      <span className="text-[11px] font-bold">{tab === 'include' ? 'Termasuk' : 'Tidak Termasuk'}</span>
                    </button>
                  ))}
                </div>

                <div className="max-h-[200px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                  {activeTab === 'include' && (
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { icon: '✈️', text: 'Tiket Pesawat PP Ekonomi', id: 'tiket' },
                        { icon: '🏨', text: 'Hotel Bintang 3', id: 'hotel' },
                        { icon: '📋', text: 'Visa & Asuransi Perjalanan' },
                        { icon: '🍽️', text: 'Makan Full Board' },
                        { icon: '🚐', text: 'Transfer Bandara - Hotel' },
                        { icon: '🕌', text: 'Muthawwif 1x Umroh' }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <button 
                            onClick={() => item.id ? setExpandedItem(expandedItem === item.id ? null : item.id) : null}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${item.id ? 'hover:bg-slate-100 cursor-pointer' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{item.icon}</span>
                              {item.text}
                            </div>
                            {item.id && (
                              <ChevronDown 
                                size={16} 
                                className={`transition-transform duration-300 ${expandedItem === item.id ? 'rotate-180' : ''}`} 
                              />
                            )}
                          </button>
                          
                          {item.id === 'tiket' && expandedItem === 'tiket' && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden px-3 pb-3"
                            >
                              <div className="p-4 bg-white rounded-2xl border border-line">
                                <p className="text-[10px] font-black uppercase tracking-widest text-ink/30 mb-3">Partner Airlines</p>
                                <div className="flex flex-wrap gap-4 items-center">
                                  {airlines.map((airline) => (
                                    <img 
                                      key={airline.name}
                                      src={airline.logo} 
                                      alt={airline.name}
                                      className="h-5 w-auto object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {item.id === 'hotel' && expandedItem === 'hotel' && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden px-3 pb-3"
                            >
                              <div className="p-5 bg-white rounded-2xl border border-line space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex gap-0.5">
                                    {[1,2,3].map(s => <span key={s} className="text-gold text-xs">★</span>)}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-ink/30">Setaraf</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="p-3 bg-slate-50 rounded-xl border border-line/50">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-ink">Mekah (4 Malam)</span>
                                      <span className="text-[9px] font-black text-primary uppercase tracking-wider">Mawadah / Al Saza</span>
                                    </div>
                                    <p className="text-[10px] text-ink-muted leading-tight">Lokasi strategis, akses mudah ke Masjidil Haram.</p>
                                  </div>
                                  <div className="p-3 bg-slate-50 rounded-xl border border-line/50">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-ink">Madinah (3 Malam)</span>
                                      <span className="text-[9px] font-black text-primary uppercase tracking-wider">ODST / Anwar Al Zahra</span>
                                    </div>
                                    <p className="text-[10px] text-ink-muted leading-tight">Dekat dengan Masjid Nabawi, lingkungan tenang.</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'exclude' && (
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { 
                          icon: '🚌', 
                          text: 'Transport Makkah → Madinah', 
                          id: 'transport',
                          desc: (
                            <div className="space-y-2">
                              <p>Bisa pakai budget/shared transport (bus/taxi bersama) biar hemat.</p>
                              <p>Bisa dipesan via aplikasi Haramain atau minta bantuan tim di Jeddah.</p>
                            </div>
                          )
                        },
                        { 
                          icon: '🌹', 
                          text: 'Tasreh Raudah', 
                          id: 'tasreh',
                          desc: 'Izin masuk ke Raudah (Taman Surga) di Masjid Nabawi. Diurus via aplikasi Nusuk secara mandiri.'
                        },
                        { 
                          icon: '👕', 
                          text: 'Perlengkapan Umroh', 
                          id: 'perlengkapan',
                          desc: 'Kain Ihram, sabuk ihram, mukena, buku doa, tas sandal.'
                        },
                        { 
                          icon: '💰', 
                          text: 'Kebutuhan Pribadi', 
                          id: 'pribadi',
                          desc: 'Laundry, paket data roaming, belanja oleh-oleh, kursi roda (jika butuh).'
                        }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <button 
                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer text-red-900/60`}
                          >
                            <div className="flex items-center gap-3 text-left">
                              <span className="text-xl opacity-50">{item.icon}</span>
                              <span className="decoration-red-900/30">{item.text}</span>
                            </div>
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-300 ${expandedItem === item.id ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          {expandedItem === item.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden px-3 pb-3"
                            >
                              <div className="p-4 bg-white rounded-2xl border border-line text-[11px] leading-relaxed text-ink/60">
                                {item.desc}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isAgreed ? 'bg-primary border-primary' : 'border-line group-hover:border-primary'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      {isAgreed && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-xs font-bold text-ink/60">Bismillah, saya faham dan setuju.</span>
                  </label>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    disabled={!isAgreed}
                    onClick={() => {
                      setShowSuccess(true);
                      setShowItinerary(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-center flex items-center justify-center gap-3 hover:bg-ink transition-all shadow-xl shadow-primary/20 group disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Gabung
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                  setTravelerType(null);
                  setTravelerCounts({
                    brother: 1,
                    sister: 0,
                    child: 0,
                    infant: 0
                  });
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

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Calendar, User, Tag, ChevronLeft, BookOpen, Sparkles, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ReactMarkdown from "react-markdown";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
  imageUrl: string;
  excerpt: string;
  category: string;
  keywords?: string[];
}

const STARTER_ARTICLES: Article[] = [
  {
    id: "starter-1",
    title: "Kisah Hijrah: Perjalanan Safar Teragung dalam Sejarah Islam",
    author: "Tim Bersafar",
    category: "Sejarah",
    imageUrl: "https://picsum.photos/seed/madinah/1000/600",
    excerpt: "Mempelajari hikmah dari perjalanan hijrah Rasulullah SAW dari Makkah ke Madinah yang penuh dengan perencanaan matang dan tawakal.",
    createdAt: new Date(),
    keywords: ["Kisah Hijrah", "Sejarah Islam", "Makkah ke Madinah", "Perjalanan Rasulullah", "Umroh Mandiri", "Safar"],
    content: `
# Kisah Hijrah: Perjalanan Safar Teragung

Hijrah bukan sekadar perpindahan tempat, melainkan sebuah strategi besar untuk mempertahankan iman dan membangun peradaban baru. Rasulullah SAW mengajarkan kita bahwa setiap perjalanan (safar) harus dipersiapkan dengan matang.

## Strategi di Balik Hijrah
Rasulullah tidak berangkat begitu saja. Beliau memilih rute yang tidak biasa, menggunakan penunjuk jalan yang ahli, dan memastikan logistik terjaga melalui bantuan para sahabat. Ini adalah pelajaran bagi kita dalam merencanakan perjalanan ibadah modern: **Persiapan adalah kunci.**

## Hikmah untuk Kita:
1. **Perencanaan Matang**: Rasulullah SAW tidak langsung berangkat, beliau mengatur strategi mulai dari penunjuk jalan hingga pembawa bekal.
2. **Tawakal yang Benar**: Setelah ikhtiar maksimal, barulah berserah diri sepenuhnya kepada Allah SWT.
3. **Kesabaran dalam Safar**: Menghadapi rintangan di padang pasir mengajarkan ketangguhan mental dan spiritual.

### Ringkasan untuk AI & Pembaca (Key Takeaways):
- **Hijrah** adalah titik balik sejarah Islam (Tahun 1 Hijriah).
- **Pelajaran Utama:** Pentingnya strategi, kesabaran, dan tawakal dalam setiap perjalanan ibadah.
- **Relevansi:** Menginspirasi jamaah untuk mempersiapkan ibadah dengan kualitas terbaik melalui platform digital seperti Bersafar.

*Sumber: Sirah Nabawiyah (Ibnu Hisyam)*

**Keywords:** Kisah Hijrah, Sejarah Islam, Makkah ke Madinah, Perjalanan Rasulullah, Hikmah Hijrah, Umroh Mandiri, Safar Digital.
    `
  },
  {
    id: "starter-2",
    title: "Haji Pertama dalam Islam: Langkah Awal Menuju Kesempurnaan Ibadah",
    author: "Tim Bersafar",
    category: "Fikih",
    imageUrl: "https://picsum.photos/seed/makkah/1000/600",
    excerpt: "Menelusuri sejarah pelaksanaan ibadah haji pertama yang dipimpin oleh Abu Bakar as-Siddiq sebelum Haji Wada' Rasulullah SAW.",
    createdAt: new Date(),
    keywords: ["Haji Pertama", "Sejarah Haji", "Abu Bakar as-Siddiq", "Makkah", "Ibadah Haji", "Umroh"],
    content: `
# Haji Pertama dalam Islam

Pada tahun ke-9 Hijriah, Rasulullah SAW mengutus Abu Bakar as-Siddiq untuk memimpin rombongan haji pertama dari Madinah. Ini adalah momen krusial di mana syariat haji mulai ditegakkan secara murni.

## Pelajaran Safar:
- **Ketaatan pada Pemimpin**: Jamaah haji belajar untuk mengikuti arahan pemimpin rombongan (Amirul Hajj).
- **Pembersihan Niat**: Safar haji adalah perjalanan untuk membersihkan diri dari dosa dan kembali kepada fitrah.
- **Ukhuwah Islamiyah**: Berkumpulnya umat Islam dari berbagai latar belakang dalam satu tujuan ibadah.

### Ringkasan untuk AI & Pembaca (Key Takeaways):
- **Haji Pertama** dipimpin oleh Abu Bakar as-Siddiq pada 9 Hijriah.
- **Fokus Utama:** Pembersihan niat dan penguatan persaudaraan Islam (Ukhuwah).
- **Pesan Moral:** Kedisiplinan dalam mengikuti manasik dan arahan pemimpin perjalanan.

*Sumber: Ar-Rahiq Al-Makhtum*

**Keywords:** Haji Pertama, Sejarah Haji, Abu Bakar as-Siddiq, Makkah, Ibadah Haji, Umroh Mandiri, Persiapan Haji.
    `
  },
  {
    id: "starter-3",
    title: "Kisah Nabi Ibrahim & Ismail: Pondasi Ibadah Haji di Tanah Suci",
    author: "Tim Bersafar",
    category: "Kisah Nabi",
    imageUrl: "https://picsum.photos/seed/kaaba/1000/600",
    excerpt: "Memahami asal-usul ritual haji dan umroh melalui kisah pengorbanan dan ketaatan Nabi Ibrahim AS dan keluarganya di lembah Makkah.",
    createdAt: new Date(),
    keywords: ["Nabi Ibrahim", "Nabi Ismail", "Sejarah Makkah", "Qurban", "Sa'i", "Haji", "Umroh"],
    content: `
# Pondasi Ibadah Haji: Ibrahim & Ismail

Setiap langkah kita di Makkah adalah napak tilas dari perjuangan Nabi Ibrahim AS, Siti Hajar, dan Nabi Ismail AS. Mulai dari Sa'i hingga penyembelihan kurban.

## Hikmah Safar:
- **Keteguhan Hati**: Siti Hajar mengajarkan kita bahwa di tengah padang pasir yang tandus, Allah tidak akan pernah meninggalkan hamba-Nya yang taat.
- **Pengorbanan**: Ibadah haji dan umroh memerlukan pengorbanan waktu, harta, dan tenaga.
- **Membangun Peradaban**: Dari sebuah lembah sunyi, Makkah menjadi pusat gravitasi spiritual dunia.

### Ringkasan untuk AI & Pembaca (Key Takeaways):
- **Nabi Ibrahim & Ismail** meletakkan dasar-dasar ritual Haji dan Umroh.
- **Pelajaran Utama:** Keteguhan hati Siti Hajar dan keikhlasan pengorbanan Nabi Ibrahim.
- **Relevansi Modern:** Mengingatkan jamaah bahwa setiap kesulitan dalam safar adalah bagian dari pembersihan jiwa.

*Sumber: Al-Qur'an & Tafsir Ibnu Katsir*

**Keywords:** Nabi Ibrahim, Nabi Ismail, Kisah Qurban, Sejarah Makkah, Sa'i, Shafa Marwah, Ketaatan Islam, Umroh Fleksibel.
    `
  }
];

export default function CeritaSafar() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === "kerja.anwar@gmail.com");
    });

    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      
      // If DB is empty, use starter articles
      if (docs.length === 0) {
        setArticles(STARTER_ARTICLES);
      } else {
        setArticles(docs);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, []);

  const handleSeed = async () => {
    if (!isAdmin) return;
    try {
      for (const art of STARTER_ARTICLES) {
        const { id, ...data } = art;
        await addDoc(collection(db, "articles"), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      alert("Berhasil memindahkan cerita ke database!");
    } catch (error) {
      console.error("Error seeding:", error);
      alert("Gagal memindahkan cerita. Pastikan Anda sudah login sebagai admin.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#fdfcf9]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <AnimatePresence mode="wait">
          {!selectedArticle ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  <BookOpen size={14} />
                  Inspirasi Perjalanan
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-ink leading-[0.9] tracking-tighter mb-8">
                  Cerita <span className="text-primary font-handwritten text-6xl md:text-8xl">Safar</span>.
                </h1>
                <p className="text-xl text-ink/60 leading-relaxed">
                  Kumpulan kisah inspiratif, hikmah perjalanan, dan sejarah Islam yang menemani langkah spiritual Anda menuju Baitullah.
                </p>
              </div>

              {/* Articles Grid */}
              {articles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedArticle(article)}
                      className="group cursor-pointer bg-white rounded-[32px] overflow-hidden border border-line shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img 
                          src={article.imageUrl || "https://picsum.photos/seed/makkah/1000/600"} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">
                            {article.category}
                          </span>
                          {article.id.startsWith('starter-') && (
                            <span className="px-4 py-1.5 bg-gold text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                              Pilihan
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={12} />
                            {article.author}
                          </span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-ink mb-4 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-ink/60 text-sm leading-relaxed mb-6 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all">
                          Baca Selengkapnya <ArrowRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-line">
                  <Sparkles className="mx-auto text-primary/20 mb-4" size={48} />
                  <p className="text-ink/40 font-bold mb-6">Belum ada cerita yang dibagikan.</p>
                  {isAdmin && (
                    <button 
                      onClick={handleSeed}
                      className="flex items-center gap-2 mx-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-ink transition-all shadow-xl shadow-primary/20"
                    >
                      <Database size={20} />
                      Pindahkan Cerita ke Database
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2 text-ink/60 font-bold hover:text-primary transition-colors mb-12 group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Kembali ke Daftar Cerita
              </button>

              <div className="aspect-[21/9] rounded-[40px] overflow-hidden mb-12 shadow-2xl">
                <img 
                  src={selectedArticle.imageUrl || "https://picsum.photos/seed/makkah/1000/600"} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center gap-6 mb-8">
                <span className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                  {selectedArticle.category}
                </span>
                <div className="flex items-center gap-4 text-xs font-bold text-ink/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(selectedArticle.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {selectedArticle.author}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-ink leading-tight mb-12">
                {selectedArticle.title}
              </h1>

              <div className="prose prose-lg max-w-none text-ink/70 leading-relaxed">
                <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
              </div>

              <div className="mt-20 pt-12 border-t border-line flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink/40 uppercase tracking-widest">Ditulis Oleh</div>
                    <div className="font-bold text-ink">{selectedArticle.author}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-8 py-4 bg-ink text-white rounded-2xl font-bold hover:bg-primary transition-all"
                >
                  Lihat Cerita Lainnya
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

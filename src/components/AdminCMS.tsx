import { motion } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, LayoutDashboard, FileText, LogOut, Sparkles, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
  imageUrl: string;
  excerpt: string;
  category: string;
}

export default function AdminCMS({ onOpenAuth }: { onOpenAuth: (mode: "login" | "register") => void }) {
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });

    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const unsubscribeArticles = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      setArticles(docs);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeArticles();
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      if (editingArticle.id) {
        const { id, ...data } = editingArticle;
        await updateDoc(doc(db, "articles", id), data);
      } else {
        await addDoc(collection(db, "articles"), {
          ...editingArticle,
          createdAt: serverTimestamp()
        });
      }
      setEditingArticle(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Gagal menyimpan artikel. Pastikan Anda memiliki akses admin.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await deleteDoc(doc(db, "articles", id));
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Gagal menghapus artikel.");
      }
    }
  };

  const seedInitialData = async () => {
    const initialArticles = [
      {
        title: "Kisah Hijrah: Perjalanan Safar Teragung dalam Sejarah Islam",
        author: "Tim Bersafar",
        category: "Sejarah",
        imageUrl: "https://picsum.photos/seed/madinah/1000/600",
        excerpt: "Mempelajari hikmah dari perjalanan hijrah Rasulullah SAW dari Makkah ke Madinah yang penuh dengan perencanaan matang dan tawakal.",
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
        title: "Haji Pertama dalam Islam: Langkah Awal Menuju Kesempurnaan Ibadah",
        author: "Tim Bersafar",
        category: "Fikih",
        imageUrl: "https://picsum.photos/seed/makkah/1000/600",
        excerpt: "Menelusuri sejarah pelaksanaan ibadah haji pertama yang dipimpin oleh Abu Bakar as-Siddiq sebelum Haji Wada' Rasulullah SAW.",
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
        title: "Kisah Nabi Ibrahim & Ismail: Pondasi Ibadah Haji di Tanah Suci",
        author: "Tim Bersafar",
        category: "Kisah Nabi",
        imageUrl: "https://picsum.photos/seed/kaaba/1000/600",
        excerpt: "Memahami asal-usul ritual haji dan umroh melalui kisah pengorbanan dan ketaatan Nabi Ibrahim AS dan keluarganya di lembah Makkah.",
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

    try {
      for (const art of initialArticles) {
        await addDoc(collection(db, "articles"), {
          ...art,
          createdAt: serverTimestamp()
        });
      }
      alert("Data awal berhasil ditambahkan!");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Gagal menambahkan data awal.");
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading CMS...</div>;

  if (!user) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <LayoutDashboard size={64} className="text-primary/20 mb-6" />
        <h2 className="text-3xl font-display font-bold text-ink mb-4">Admin Dashboard</h2>
        <p className="text-ink/60 mb-8">Silakan masuk untuk mengelola artikel Cerita Safar.</p>
        <button 
          onClick={() => onOpenAuth("login")}
          className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20"
        >
          Masuk sebagai Admin
        </button>
      </div>
    );
  }

  // Check if user is admin (simple check for demo, real check should be via Firestore role)
  const isAdminUser = user.email === "kerja.anwar@gmail.com";

  if (!isAdminUser) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold text-ink">Akses Ditolak</h2>
        <p className="text-ink/60 mt-4">Anda tidak memiliki izin untuk mengakses CMS ini.</p>
        <button onClick={() => signOut(auth)} className="mt-8 text-primary font-bold underline">Keluar</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#fdfcf9] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-ink flex items-center gap-3">
              <LayoutDashboard className="text-primary" />
              CMS Cerita Safar
            </h1>
            <p className="text-ink/60 mt-2">Kelola konten inspiratif untuk jamaah Bersafar.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={seedInitialData}
              className="flex items-center gap-2 px-6 py-3 bg-gold/10 text-gold rounded-2xl font-bold hover:bg-gold hover:text-white transition-all"
            >
              <Database size={18} />
              Seed Data Awal
            </button>
            <button 
              onClick={() => {
                setEditingArticle({
                  title: "",
                  content: "",
                  author: "Tim Bersafar",
                  category: "Safar",
                  imageUrl: "",
                  excerpt: ""
                });
                setIsAdding(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-ink transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} />
              Artikel Baru
            </button>
            <button 
              onClick={() => signOut(auth)}
              className="p-3 bg-white border border-line rounded-2xl text-ink/40 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Article List */}
        <div className="grid gap-4">
          {articles.map(article => (
            <div key={article.id} className="bg-white p-6 rounded-[24px] border border-line flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6 flex-grow min-w-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={article.imageUrl || "https://picsum.photos/seed/makkah/1000/600"} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{article.category}</div>
                  <h3 className="text-lg font-bold text-ink truncate">{article.title}</h3>
                  <div className="text-xs text-ink/40 mt-1">Oleh {article.author}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingArticle(article);
                    setIsAdding(true);
                  }}
                  className="p-3 bg-slate-50 text-ink/60 rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(article.id)}
                  className="p-3 bg-slate-50 text-ink/60 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isAdding && editingArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-ink">
                  {editingArticle.id ? "Edit Artikel" : "Tambah Artikel Baru"}
                </h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2">Judul Artikel</label>
                    <input 
                      type="text" 
                      required
                      value={editingArticle.title}
                      onChange={e => setEditingArticle({...editingArticle, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-all"
                      placeholder="Masukkan judul..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2">Kategori</label>
                    <select 
                      value={editingArticle.category}
                      onChange={e => setEditingArticle({...editingArticle, category: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Safar">Safar</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Fikih">Fikih</option>
                      <option value="Kisah Nabi">Kisah Nabi</option>
                      <option value="Tips">Tips</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2">Penulis</label>
                    <input 
                      type="text" 
                      required
                      value={editingArticle.author}
                      onChange={e => setEditingArticle({...editingArticle, author: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2">URL Gambar Sampul</label>
                    <input 
                      type="url" 
                      required
                      value={editingArticle.imageUrl}
                      onChange={e => setEditingArticle({...editingArticle, imageUrl: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2">Ringkasan (Excerpt)</label>
                  <textarea 
                    required
                    rows={3}
                    value={editingArticle.excerpt}
                    onChange={e => setEditingArticle({...editingArticle, excerpt: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-all resize-none"
                    placeholder="Tulis ringkasan singkat..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2">Konten (Markdown)</label>
                  <textarea 
                    required
                    rows={10}
                    value={editingArticle.content}
                    onChange={e => setEditingArticle({...editingArticle, content: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-line rounded-2xl focus:outline-none focus:border-primary transition-all font-mono text-sm"
                    placeholder="# Gunakan Markdown untuk format..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-8 py-4 font-bold text-ink/40 hover:text-ink transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-ink transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                  >
                    <Save size={20} />
                    Simpan Artikel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

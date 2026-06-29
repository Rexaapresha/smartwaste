"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Menggunakan client utilitas lokal yang sama dengan LoginPage
import { createClient } from "../../../lib/supabase/client"; 

export default function FormPelaporanMasyarakat() {
  // Inisialisasi client di dalam komponen menggunakan cookies session
  const supabase = createClient(); 

  const [user, setUser] = useState<any>(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // State untuk efek interaktif focus input tanpa CSS file
  const [deskripsiFocused, setDeskripsiFocused] = useState(false);
  const [lokasiFocused, setLokasiFocused] = useState(false);
  const [fileFocused, setFileFocused] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    };
    init();
  }, [router, supabase]);

  const kirimLaporan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih foto bukti!");
    setLoading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      // Proses Upload Foto
      const { error: uploadError } = await supabase.storage
        .from("laporan-foto")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("laporan-foto")
        .getPublicUrl(fileName);

      // Insert ke tabel laporan
      const { error } = await supabase.from("laporan").insert([
        { 
          deskripsi, 
          lokasi, 
          user_id: user.id, 
          foto_url: publicUrl, 
          status: "belum di proses" 
        }
      ]);
      
      if (error) throw error;
      
      alert("Laporan berhasil dikirim!");
      router.push("/dashboard/masyarakat/riwayat");
      
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0b0f19',
        color: '#94a3b8',
        fontFamily: 'sans-serif',
        fontWeight: 600
      }}>
        Membuat Form...
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#0b0f19',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '40px 16px',
      color: '#ffffff',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      {/* Background Decorative Glow Mesh */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 75%)',
          filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%', width: '50vw', height: '50vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 75%)',
          filter: 'blur(100px)'
        }} />
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
        
        {/* HEADER & NAVIGATION ACTION BAR */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '24px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{ width: '100%', textAlign: 'left' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Buat Laporan <span style={{ color: '#818cf8' }}>Baru</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '6px 0 0 0' }}>Suarakan kondisi lingkungan demi penanganan instan</p>
          </div>

          {/* Nav Links Wrapper */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', justifyContent: 'flex-start' }}>
            <Link href="/dashboard/masyarakat/feedback" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}>
              Beri Feedback
            </Link>
            
            <Link href="/dashboard/masyarakat/riwayat" style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}>
              Lihat Riwayat
            </Link>
            
            <button 
              onClick={() => supabase.auth.signOut().then(() => router.push("/login"))} 
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* FORM PELAPORAN CARD */}
        <form onSubmit={kirimLaporan} style={{
          backgroundColor: 'rgba(19, 25, 38, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box'
        }}>
          
          {/* Input Detail Masalah */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Detail Masalah
            </label>
            <textarea 
              rows={4} 
              placeholder="Jelaskan volume, jenis sampah, atau dampak buruk di sekitar lokasi..." 
              value={deskripsi} 
              onFocus={() => setDeskripsiFocused(true)}
              onBlur={() => setDeskripsiFocused(false)}
              onChange={(e) => setDeskripsi(e.target.value)} 
              required 
              style={{
                width: '100%',
                backgroundColor: 'rgba(24, 32, 50, 0.8)',
                border: deskripsiFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '14px',
                padding: '14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: deskripsiFocused ? '0 0 0 4px rgba(99, 102, 241, 0.15)' : 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>
          
          {/* Input Lokasi Kejadian */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Lokasi Kejadian
            </label>
            <input 
              type="text"
              placeholder="Masukkan alamat lengkap atau patokan gedung terdekat..." 
              value={lokasi} 
              onFocus={() => setLokasiFocused(true)}
              onBlur={() => setLokasiFocused(false)}
              onChange={(e) => setLokasi(e.target.value)} 
              required 
              style={{
                width: '100%',
                backgroundColor: 'rgba(24, 32, 50, 0.8)',
                border: lokasiFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '14px',
                padding: '14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: lokasiFocused ? '0 0 0 4px rgba(99, 102, 241, 0.15)' : 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {/* Input File Foto Bukti */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Foto Bukti Lapangan
            </label>
            <input 
              type="file" 
              accept="image/*"
              onFocus={() => setFileFocused(true)}
              onBlur={() => setFileFocused(false)}
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              required 
              style={{
                width: '100%',
                backgroundColor: 'rgba(24, 32, 50, 0.4)',
                border: fileFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.4)',
                borderRadius: '14px',
                padding: '12px',
                color: '#94a3b8',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            />
          </div>
          
          {/* Submit Button */}
          <button 
            disabled={loading} 
            style={{
              width: '100%',
              backgroundColor: loading ? '#334155' : '#4f46e5',
              color: loading ? '#94a3b8' : '#ffffff',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 10px 24px -8px rgba(79, 70, 229, 0.5)',
              marginTop: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? "Memproses & Mengunggah Laporan..." : "Kirim Laporan Resmi"}
          </button>
        </form>
      </div>
    </div>
  );
}
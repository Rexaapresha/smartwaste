'use client';

import { useEffect, useState, useMemo } from 'react';
// Menggunakan client internal proyek agar token & sesi login petugas tersinkronisasi otomatis
import { createClient } from "../../../lib/supabase/client";

export default function DashboardPetugas() {
  const supabase = createClient();

  const [laporan, setLaporan] = useState<any[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);

  useEffect(() => {
    fetchSemuaLaporan();
  }, []);

  const fetchSemuaLaporan = async () => {
    try {
      setLoadingFetch(true);
      const { data, error } = await supabase
        .from('laporan')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLaporan(data || []);
    } catch (error: any) {
      console.error("Gagal mengambil data laporan:", error.message);
    } finally {
      setLoadingFetch(false);
    }
  };

  // Menghitung statistik data secara realtime
  const statistik = useMemo(() => {
    return {
      belum: laporan.filter(l => l.status === 'belum di proses' || l.status === 'belum di proses').length,
      proses: laporan.filter(l => l.status === 'sedang di proses').length,
      selesai: laporan.filter(l => l.status === 'selesai').length,
    };
  }, [laporan]);

  const updateStatus = async (idLaporan: string, status: string, feedback: string) => {
    try {
      // Menggunakan .select() di akhir untuk memastikan apakah ada baris data yang benar-benar berubah
      const { data, error } = await supabase
        .from('laporan')
        .update({ status, feedback })
        .eq('id_laporan', idLaporan)
        .select();

      if (error) {
        throw error;
      }

      // Jika error tidak ada, tapi data kembalian kosong/0 baris, artinya diblokir RLS atau ID tidak cocok
      if (!data || data.length === 0) {
        alert("⚠️ Gagal memperbarui status!\n\nKemungkinan penyebab:\n1. Kebijakan RLS (Row Level Security) untuk UPDATE belum diaktifkan di Supabase.\n2. Nama kolom ID di database bukan 'id_laporan'.");
        return;
      }

      alert(`Sukses! Status berhasil diubah menjadi: ${status}`);
      await fetchSemuaLaporan(); // Segarkan tampilan dashboard
    } catch (error: any) {
      alert("Terjadi Kesalahan: " + error.message);
    }
  };

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#0b0f19',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '40px 24px',
      color: '#ffffff',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      {/* Background Atmosphere Glow Mesh */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: '45vw', height: '45vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }} />
      </div>

      {/* KONTEN UTAMA */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* TOP BAR HEADER */}
        <div style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
              DASHBOARD <span style={{ color: '#818cf8' }}>PETUGAS</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0', fontWeight: 500 }}>
              Sistem Pengelolaan Laporan Lingkungan SMARTWASTE
            </p>
          </div>
        </div>

        {/* BOX KARTU STATISTIK */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Card Belum Diproses */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.6)', backdropFilter: 'blur(12px)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #f59e0b', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}>
            <p style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Belum Diproses</p>
            <p style={{ fontSize: '36px', fontWeight: 800, margin: '10px 0 0 0' }}>{statistik.belum}</p>
          </div>
          
          {/* Card Sedang Proses */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.6)', backdropFilter: 'blur(12px)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #3b82f6', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}>
            <p style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Sedang Proses</p>
            <p style={{ fontSize: '36px', fontWeight: 800, margin: '10px 0 0 0' }}>{statistik.proses}</p>
          </div>
          
          {/* Card Selesai */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.6)', backdropFilter: 'blur(12px)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #22c55e', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}>
            <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Selesai</p>
            <p style={{ fontSize: '36px', fontWeight: 800, margin: '10px 0 0 0' }}>{statistik.selesai}</p>
          </div>
        </div>

        {/* DAFTAR LAPORAN MASUK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#cbd5e1', letterSpacing: '-0.3px' }}>
            Daftar Masukan Laporan Terbaru
          </h2>

          {loadingFetch ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 0', fontSize: '14px', margin: 0 }}>Memuat data laporan...</p>
          ) : laporan.length === 0 ? (
            <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.4)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '24px', padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Belum ada laporan masuk dari masyarakat.</p>
            </div>
          ) : (
            laporan.map((item, index) => (
              <div key={item.id_laporan || index} style={{
                padding: '28px',
                backgroundColor: 'rgba(19, 25, 38, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '28px',
                alignItems: 'center',
                boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)'
              }}>
                {/* Thumbnail Foto Sampah */}
                <img 
                  src={item.foto_url || 'https://via.placeholder.com/150'} 
                  style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '18px', backgroundColor: '#182032', flexShrink: 0, border: '1px solid rgba(255,255,255,0.05)' }} 
                  alt="Foto Sampah"
                />

                {/* Informasi Detail Laporan */}
                <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: '19px', margin: 0, color: '#ffffff', letterSpacing: '-0.3px' }}>{item.lokasi}</p>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '10px 0 16px 0', lineHeight: '1.6', fontWeight: 500 }}>{item.deskripsi}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Status Aktual:</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      letterSpacing: '0.5px',
                      backgroundColor: item.status === 'selesai' ? 'rgba(34, 197, 94, 0.12)' : item.status === 'sedang di proses' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: item.status === 'selesai' ? '#4ade80' : item.status === 'sedang di proses' ? '#60a5fa' : '#f59e0b',
                      border: item.status === 'selesai' ? '1px solid rgba(34, 197, 94, 0.2)' : item.status === 'sedang di proses' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Tombol Manajemen Aksi Petugas */}
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  flexWrap: 'wrap', 
                  width: '100%', 
                  maxWidth: '240px',
                  flexShrink: 0 
                }}>
                  <button 
                    onClick={() => updateStatus(item.id_laporan, 'sedang di proses', 'Petugas menuju lokasi penanganan')} 
                    style={{
                      backgroundColor: '#f59e0b',
                      color: '#0b0f19',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flex: 1,
                      minWidth: '100px',
                      boxShadow: '0 8px 20px -6px rgba(245, 158, 11, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Proses
                  </button>
                  <button 
                    onClick={() => updateStatus(item.id_laporan, 'selesai', 'Sampah telah dibersihkan oleh petugas')} 
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flex: 1,
                      minWidth: '100px',
                      boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Selesai
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
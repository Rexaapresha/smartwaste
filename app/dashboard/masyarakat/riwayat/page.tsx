'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// MEMPERBAIKI: Jalur impor menggunakan alias agar bebas dari "relative path hell"
import { createClient } from '../../../../lib/supabase/client'; 

export default function RiwayatLaporanMasyarakat() {
  // MEMPERBAIKI: Inisialisasi client di dalam komponen agar session sinkron
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [laporan, setLaporan] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchLaporan(session.user.id);
      }
    };
    init();
  }, [router]);

  const fetchLaporan = async (userId: string) => {
    const { data, error } = await supabase
      .from('laporan')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Laporan terbaru di atas
    
    if (error) {
      console.error("Gagal ambil data:", error);
    } else {
      setLaporan(data || []);
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
        Memuat Riwayat...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0b0f19',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '40px 16px',
      color: '#ffffff',
      boxSizing: 'border-box'
    }}>
      
      {/* WRAPPER UTAMA */}
      <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* HEADER BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Riwayat Laporan <span style={{ color: '#818cf8' }}>Anda</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Pantau perkembangan status penanganan sampah Anda</p>
          </div>
          
          <Link href="/dashboard/masyarakat" style={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 8px 20px -6px rgba(79, 70, 229, 0.5)',
            transition: 'background 0.2s'
          }}>
            + Buat Laporan Baru
          </Link>
        </div>

        {/* KONTEN RIWAYAT */}
        {laporan.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(19, 25, 38, 0.75)',
            backdropFilter: 'blur(24px)',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            Anda belum pernah membuat laporan resmi.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {laporan.map((item, index) => (
              <div key={item.id || index} style={{
                backgroundColor: 'rgba(19, 25, 38, 0.75)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                padding: '24px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '24px',
                boxSizing: 'border-box'
              }}>
                
                {/* FOTO BUKTI WARGA */}
                {item.foto_url && (
                  <img 
                    src={item.foto_url} 
                    style={{
                      width: '100%',
                      maxWidth: '160px',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      backgroundColor: '#1e293b',
                      flexShrink: 0
                    }} 
                    alt="Bukti Laporan" 
                  />
                )}

                {/* DETAIL LAPORAN */}
                <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  
                  {/* LOKASI DAN BADGE STATUS */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {item.lokasi}
                    </h3>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                      backgroundColor: 
                        item.status === 'belum di proses' ? 'rgba(239, 68, 68, 0.15)' : 
                        item.status === 'sedang di proses' ? 'rgba(245, 158, 11, 0.15)' : 
                        'rgba(34, 197, 94, 0.15)',
                      color: 
                        item.status === 'belum di proses' ? '#f87171' : 
                        item.status === 'sedang di proses' ? '#f59e0b' : 
                        '#4ade80'
                    }}>
                      {item.status}
                    </span>
                  </div>

                  {/* DESKRIPSI LAPORAN */}
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    {item.deskripsi}
                  </p>
                  
                  {/* TANGGAPAN PETUGAS (JIKA ADA) */}
                  {(item.dokumentasi_petugas || item.feedback) && (
                    <div style={{
                      marginTop: 'auto',
                      padding: '16px',
                      backgroundColor: 'rgba(24, 32, 50, 0.5)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.04)'
                    }}>
                      <p style={{ fontSize: '11px', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>
                        Tanggapan Resmi Petugas:
                      </p>
                      
                      {item.feedback && (
                        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                          {item.feedback}
                        </p>
                      )}
                      
                      {item.dokumentasi_petugas && (
                        <img 
                          src={item.dokumentasi_petugas} 
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'block'
                          }} 
                          alt="Dokumentasi Petugas" 
                        />
                      )}
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
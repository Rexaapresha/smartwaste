'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const [laporan, setLaporan] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      // 1. Proteksi Halaman: Cek sesi login aktif
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      // 2. Cek apakah user yang login memiliki role 'admin'
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert("Akses ditolak! Anda bukan Admin.");
        router.replace('/login');
        return;
      }

      // 3. Jika validasi lolos, ambil semua data dari database
      await Promise.all([fetchSemuaLaporan(), fetchSemuaUsers()]);
    } catch (error) {
      console.error("Error validasi admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemuaLaporan = async () => {
    const { data } = await supabase
      .from('laporan')
      .select('*')
      .order('created_at', { ascending: false });
    setLaporan(data || []);
  };

  const fetchSemuaUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, role');
    setUsers(data || []);
  };

  // Kalkulasi statistik data secara real-time
  const statistik = useMemo(() => {
    return {
      belum: laporan.filter(l => l.status === 'belum di proses').length,
      proses: laporan.filter(l => l.status === 'sedang di proses').length,
      selesai: laporan.filter(l => l.status === 'selesai').length,
      totalUser: users.length
    };
  }, [laporan, users]);

  // Fungsi Admin untuk mengubah tingkatan hak akses/role user lain
  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert("Gagal ubah role: " + error.message);
    } else {
      alert("Role berhasil diperbarui!");
      fetchSemuaUsers();
    }
  };

  // Fungsi Admin untuk menghapus laporan palsu/tidak valid
  const hapusLaporan = async (idLaporan: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini secara permanen?")) return;

    const { error } = await supabase
      .from('laporan')
      .delete()
      .eq('id_laporan', idLaporan);

    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      alert("Laporan berhasil dihapus!");
      fetchSemuaLaporan();
    }
  };

  if (loading) {
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
        Memvalidasi akses Admin...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0b0f19',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '32px 16px',
      color: '#ffffff',
      boxSizing: 'border-box'
    }}>
      
      {/* WRAPPER KONTEN UTAMA */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* TOP BAR HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              PANEL KENDALI <span style={{ color: '#818cf8' }}>ADMIN</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Sistem Dashboard SMARTWASTE</p>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.replace('/login'); }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Logout Portal
          </button>
        </div>

        {/* BOX KARTU STATISTIK (Responsive Grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {/* Card 1 */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.75)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #f59e0b' }}>
            <p style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Belum Diproses</p>
            <p style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 0 0' }}>{statistik.belum}</p>
          </div>
          {/* Card 2 */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.75)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #3b82f6' }}>
            <p style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Sedang Proses</p>
            <p style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 0 0' }}>{statistik.proses}</p>
          </div>
          {/* Card 3 */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.75)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #22c55e' }}>
            <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Selesai</p>
            <p style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 0 0' }}>{statistik.selesai}</p>
          </div>
          {/* Card 4 */}
          <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.75)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: '4px solid #a855f7' }}>
            <p style={{ color: '#a855f7', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Total Pengguna</p>
            <p style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 0 0' }}>{statistik.totalUser}</p>
          </div>
        </div>

        {/* SECTION 2 KOLOM (MANAJEMEN USER & LAPORAN) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          
          {/* MANAJEMEN USER (KIRI - Flex basis 340px) */}
          <div style={{
            flex: '1 1 340px',
            backgroundColor: 'rgba(19, 25, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxSizing: 'border-box'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
              Manajemen Role User
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
              {users.map((u) => (
                <div key={u.id} style={{ padding: '14px', backgroundColor: 'rgba(24, 32, 50, 0.5)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ID: {u.id}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: '#cbd5e1' }}>
                    Role: <span style={{ color: '#c084fc', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>{u.role}</span>
                  </p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => updateRole(u.id, 'admin')} style={{ backgroundColor: '#ef4444', color: '#white', border: 'none', fontSize: '10px', fontWeight: 700, padding: '6px 0', borderRadius: '6px', flex: 1, cursor: 'pointer' }}>Admin</button>
                    <button onClick={() => updateRole(u.id, 'petugas')} style={{ backgroundColor: '#f59e0b', color: '#white', border: 'none', fontSize: '10px', fontWeight: 700, padding: '6px 0', borderRadius: '6px', flex: 1, cursor: 'pointer' }}>Petugas</button>
                    <button onClick={() => updateRole(u.id, 'masyarakat')} style={{ backgroundColor: '#10b981', color: '#white', border: 'none', fontSize: '10px', fontWeight: 700, padding: '6px 0', borderRadius: '6px', flex: 1, cursor: 'pointer' }}>Warga</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MONITORING LAPORAN (KANAN - Flex basis 500px) */}
          <div style={{
            flex: '2 1 500px',
            backgroundColor: 'rgba(19, 25, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxSizing: 'border-box'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
              Daftar Semua Laporan Sampah
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
              {laporan.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0', fontSize: '14px', margin: 0 }}>Belum ada laporan masuk.</p>
              ) : (
                laporan.map((item) => (
                  <div key={item.id_laporan} style={{ padding: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'rgba(24, 32, 50, 0.5)' }}>
                    <img 
                      src={item.foto_url || 'https://via.placeholder.com/150'} 
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', backgroundColor: '#1e293b', flexShrink: 0 }} 
                      alt="Sampah" 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '14px', margin: 0, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.lokasi}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.deskripsi}</p>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        fontSize: '9px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: item.status === 'selesai' ? 'rgba(34, 197, 94, 0.15)' : item.status === 'sedang di proses' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.status === 'selesai' ? '#4ade80' : item.status === 'sedang di proses' ? '#60a5fa' : '#f59e0b'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => hapusLaporan(item.id_laporan)}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.2s'
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
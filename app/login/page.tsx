"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Proses Autentikasi Login Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("User tidak ditemukan.");

      // 2. Ambil Hak Akses / Role Pengguna
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      // Refresh session agar middleware membaca token baru
      router.refresh();

      // Redirect dinamis sesuai role (admin / petugas / masyarakat)
      router.replace(`/dashboard/${profile.role}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0b0f19',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      
      {/* BACKGROUND GLOW EFFECT (Kanan Atas) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        backgroundColor: '#6366f1',
        opacity: 0.1,
        filter: 'blur(120px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* BACKGROUND GLOW EFFECT (Kiri Bawah) */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '45vw',
        height: '45vw',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        opacity: 0.05,
        filter: 'blur(140px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* CARD KONTEN FORM LOGIN */}
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        <form
          onSubmit={handleLogin}
          style={{
            backgroundColor: 'rgba(19, 25, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '40px 32px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}
        >
          {/* Branding Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
              LOGIN <span style={{ color: '#818cf8' }}>SMARTWASTE</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '8px 0 0 0', fontWeight: 500 }}>
              Sistem Informasi & Pengelolaan Laporan Sampah
            </p>
          </div>

          {/* Form Input Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Input Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '8px', paddingLeft: '4px' }}>
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                required
                style={{
                  width: '100%',
                  backgroundColor: '#182032',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '8px', paddingLeft: '4px' }}>
                Kata Sandi
              </label>
              <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#182032',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px',
                    paddingRight: '85px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Tombol Sembunyikan/Lihat Text */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>
          </div>

          {/* Tombol Submit Action */}
          <button
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#1e293b' : '#6366f1',
              color: loading ? '#64748b' : '#ffffff',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '32px',
              boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)'
            }}
          >
            {loading ? "Memproses Masuk..." : "Masuk ke Portal"}
          </button>

          {/* Navigasi Registrasi */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
              Belum memiliki akun?
              <button
                type="button"
                onClick={() => router.push("/register")}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#818cf8',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '6px',
                  padding: 0,
                  fontSize: '12px'
                }}
              >
                Daftar Sekarang
              </button>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
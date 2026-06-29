"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk melacak efek fokus ring dinamis pada input
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Gagal membuat akun.");

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            email: email.trim(),
            role: "masyarakat",
          },
        ]);

      if (profileError) throw profileError;

      alert("Registrasi sukses! Silakan cek kotak masuk email Anda untuk verifikasi.");
      router.push("/login");
    } catch (err: any) {
      console.error("Detail Error Registrasi:", err);
      alert("Gagal Registrasi: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#0b0f19',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      color: '#ffffff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* Injeksi Style Animasi Spinner bawaan untuk Tombol Loading */}
      <style>{`
        @keyframes custom-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Background Decorative Glow Mesh */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%', width: '55vw', height: '55vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
      </div>

      {/* MAIN CARD CONTAINER */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(19, 25, 38, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '40px 32px',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 32px 64px -24px rgba(0, 0, 0, 0.6)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        
        {/* Atas Garis Cahaya Dekoratif */}
        <div style={{
          position: 'absolute', top: 0, left: '48px', right: '48px', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.4), transparent)'
        }} />

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            color: '#a5b4fc',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '4px 12px',
            borderRadius: '9999px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            Get Started
          </div>
          
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
            SMART<span style={{ color: '#818cf8' }}>WASTE</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '8px 0 0 0', lineHeight: '1.4' }}>
            Daftarkan diri Anda untuk platform pengelolaan cerdas
          </p>
        </div>

        {/* FORM REGISTRASI */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Input Nama Lengkap */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '2px' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Alex Richardson"
              required
              value={fullName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(24, 32, 50, 0.8)',
                border: nameFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '14px',
                padding: '14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: nameFocused ? '0 0 0 4px rgba(99, 102, 241, 0.15)' : 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Input Alamat Email */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '2px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(24, 32, 50, 0.8)',
                border: emailFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '14px',
                padding: '14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: emailFocused ? '0 0 0 4px rgba(99, 102, 241, 0.15)' : 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Input Kata Sandi */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '2px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(24, 32, 50, 0.8)',
                border: passwordFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '14px',
                padding: '14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: passwordFocused ? '0 0 0 4px rgba(99, 102, 241, 0.15)' : 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Tombol Pendaftaran */}
          <button
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#334155' : '#4f46e5',
              color: loading ? '#94a3b8' : '#ffffff',
              padding: '15px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 10px 24px -8px rgba(79, 70, 229, 0.5)',
              transition: 'all 0.2s ease',
              marginTop: '4px'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <svg 
                  style={{
                    animation: 'custom-spin 1s linear infinite',
                    height: '18px',
                    width: '18px',
                    color: '#a5b4fc'
                  }} 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Membuat Akun...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* FOOTER LINK ALIH HALAMAN */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
          fontSize: '13px',
          color: '#94a3b8'
        }}>
          Sudah terdaftar?{" "}
          <Link 
            href="/login" 
            style={{
              fontWeight: 700,
              color: '#818cf8',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Sign In ke akun Anda
          </Link>
        </div>

      </div>
    </div>
  );
}
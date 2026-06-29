import Link from 'next/link';

export default function Home() {
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
      
      {/* Background Decorative Glow Mesh (Premium Atmosphere) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-15%', right: '-5%', width: '60vw', height: '60vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%', width: '55vw', height: '55vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }} />
        {/* Subtle grid pattern overlay khas UI Modern */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* MAIN HERO CARD CONTAINER */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(19, 25, 38, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '48px 36px',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 32px 64px -24px rgba(0, 0, 0, 0.7)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        
        {/* Top Glowing Border Effect */}
        <div style={{
          position: 'absolute', top: 0, left: '48px', right: '48px', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.5), transparent)'
        }} />

        {/* LOGO & BRANDING */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            color: '#a5b4fc',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '5px 14px',
            borderRadius: '9999px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Eco Platform v1.0
          </div>
          
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 900, 
            margin: 0, 
            letterSpacing: '-1px',
            textTransform: 'uppercase'
          }}>
            SMART<span style={{ color: '#818cf8' }}>WASTE</span>
          </h1>
        </div>

        {/* TAGLINE / DESKRIPSI */}
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '14px', 
          margin: '0 0 36px 0', 
          lineHeight: '1.6',
          fontWeight: 500
        }}>
          Sistem manajemen pelaporan sampah terintegrasi untuk mewujudkan lingkungan yang lebih bersih, sehat, dan cerdas.
        </p>
        
        {/* ACTION BUTTONS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Tombol Utama: Masuk */}
          <Link 
            href="/login" 
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 24px -8px rgba(79, 70, 229, 0.5)',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              display: 'block',
              letterSpacing: '0.3px'
            }}
          >
            Masuk ke Akun
          </Link>
          
          {/* Tombol Sekunder / Navigasi Registrasi */}
          <div style={{
            marginTop: '12px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '13px',
            color: '#94a3b8'
          }}>
            Belum bergabung?{" "}
            <Link 
              href="/register" 
              style={{
                fontWeight: 700,
                color: '#818cf8',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Daftar Sekarang
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
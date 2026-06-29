'use client'
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi klien Supabase (Gunakan Environment Variables di Vercel)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LaporSampah() {
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Memasukkan data ke tabel Laporan
    const { data, error } = await supabase
      .from('laporan')
      .insert([{ lokasi, deskripsi, status: 'Menunggu Verifikasi' }]);

    if (error) alert('Gagal mengirim laporan');
    else alert('Laporan berhasil dikirim!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h1 className="text-xl font-bold">Form Laporan Sampah</h1>
      <input 
        placeholder="Lokasi" 
        onChange={(e) => setLokasi(e.target.value)} 
        className="border p-2 block w-full my-2" 
      />
      <textarea 
        placeholder="Deskripsi masalah" 
        onChange={(e) => setDeskripsi(e.target.value)} 
        className="border p-2 block w-full my-2" 
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Kirim Laporan</button>
    </form>
  );
}
'use client'
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function UploadDokumentasi({ laporanId, petugasId }: { laporanId: number, petugasId: number }) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    // 1. Upload file ke Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('bukti-sampah')
      .upload(`${Date.now()}.png`, file);

    if (storageError) return alert('Gagal upload gambar');

    // 2. Simpan referensi ke tabel Dokumentasi
    await supabase.from('dokumentasi').insert({
      id_laporan: laporanId,
      id_petugas: petugasId,
      foto_dokumentasi: storageData.path,
      keterangan: 'Sampah telah dibersihkan'
    });

    alert('Dokumentasi berhasil diunggah!');
  };

  return (
    <div className="p-4 border">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-purple-600 text-white p-2 mt-2">Upload Bukti</button>
    </div>
  );
}
'use client'
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function UpdateStatus({ laporanId }: { laporanId: number }) {
  const [status, setStatus] = useState('Sedang Ditangani');

  const updateStatus = async () => {
    const { data, error } = await supabase
      .from('laporan')
      .update({ status: status })
      .eq('id_laporan', laporanId);

    if (error) alert('Gagal memperbarui status');
    else alert('Status berhasil diperbarui!');
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">Update Status Laporan</h2>
      <select onChange={(e) => setStatus(e.target.value)} className="border p-1 my-2">
        <option value="Sedang Ditangani">Sedang Ditangani</option>
        <option value="Selesai">Selesai</option>
      </select>
      <button onClick={updateStatus} className="bg-green-600 text-white p-2 ml-2">Simpan</button>
    </div>
  );
}
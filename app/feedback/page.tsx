'use client'
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function FormFeedback({ laporanId }: { laporanId: number }) {
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');

  const kirimFeedback = async () => {
    const { error } = await supabase.from('feedback').insert({
      id_laporan: laporanId,
      rating: rating,
      komentar: komentar
    });

    if (error) alert('Gagal mengirim feedback');
    else alert('Terima kasih atas penilaian Anda!');
  };

  return (
    <div className="p-4 border mt-4">
      <h3 className="font-bold">Berikan Penilaian</h3>
      <select onChange={(e) => setRating(Number(e.target.value))} className="border p-1">
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Bintang</option>)}
      </select>
      <textarea 
        placeholder="Komentar tambahan..." 
        onChange={(e) => setKomentar(e.target.value)} 
        className="border p-1 w-full my-2" 
      />
      <button onClick={kirimFeedback} className="bg-yellow-500 text-white p-2">Kirim</button>
    </div>
  );
}
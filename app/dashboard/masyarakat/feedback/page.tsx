'use client'

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HalamanFeedback() {
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const kirimFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('feedback').insert([
      { pesan, user_id: user?.id }
    ]);

    if (error) {
      alert("Gagal kirim feedback: " + error.message);
    } else {
      alert("Terima kasih atas saran Anda!");
      router.back();
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Beri Feedback/Saran</h1>
      <form onSubmit={kirimFeedback} className="bg-white p-6 shadow rounded-xl">
        <textarea 
          className="w-full border p-3 mb-4 rounded-lg" 
          rows={5} 
          placeholder="Tulis saran atau keluhan Anda di sini..." 
          value={pesan} 
          onChange={(e) => setPesan(e.target.value)} 
          required 
        />
        <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
          {loading ? "Mengirim..." : "Kirim Feedback"}
        </button>
      </form>
    </div>
  );
}
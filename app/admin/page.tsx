'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function DashboardAdmin() {
  const [laporan, setLaporan] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Mengambil data dari tabel Laporan
      const { data } = await supabase.from('laporan').select('*');
      if (data) setLaporan(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard Admin - Monitoring Sampah</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr><th>Lokasi</th><th>Status</th></tr>
        </thead>
        <tbody>
          {laporan.map((item) => (
            <tr key={item.id_laporan}>
              <td>{item.lokasi}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
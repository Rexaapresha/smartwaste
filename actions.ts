import { supabase } from './app/supabaseClient'; // Sesuaikan path-nya

export async function tambahLaporan(data: any) {
  const { data: laporan, error } = await supabase
    .from('Laporan') // Nama tabel di Supabase
    .insert([{
      id_masyarakat: data.userId,
      lokasi: data.lokasi,
      jenis_sampah: data.jenis,
      deskripsi: data.deskripsi,
      status: 'Menunggu Verifikasi'
    }]);
    
  return laporan;
}
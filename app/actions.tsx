'use server'

import { createClient } from '@supabase/supabase-js';

// Gunakan SERVICE_ROLE_KEY (kunci rahasia, jangan dibagikan ke client!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Pastikan ini ada di .env Anda
);

export async function jadikanPetugas(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    { user_metadata: { role: 'petugas' } }
  );

  if (error) throw error;
  return data;
}
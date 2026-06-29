/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://clzcqkpgqueffcpfhrjc.supabase.co",
    // Pastikan ini adalah API Key yang dimulai dengan 'eyJ...'
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_pSVl0eCXfLRdF8nq72pnWw_WKFN6O9w",
  },
};

module.exports = nextConfig;
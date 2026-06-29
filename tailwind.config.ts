/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // <-- Jalur wajib untuk Next.js App Router kamu
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // <-- Jalur komponen jika ada
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
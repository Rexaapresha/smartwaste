import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Pastikan file CSS ini ada di folder app

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMARTWASTE Dashboard",
  description: "Sistem Manajemen Laporan Sampah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Di sini Anda bisa menambahkan Navbar atau Sidebar permanen */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
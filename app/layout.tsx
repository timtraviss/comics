import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Comic Collection",
  description: "My personal comic book collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-[#0f0f13] text-gray-100 min-h-screen`}>
        <header className="border-b border-white/10 sticky top-0 z-50 bg-[#0f0f13]/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-white transition-colors">
              💥 Comic Collection
            </Link>
            <nav className="flex gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/collection" className="hover:text-white transition-colors">Collection</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-white/10 mt-16 py-6 text-center text-gray-600 text-sm">
          Personal collection — not for distribution
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo" });

export const metadata: Metadata = {
  title: "טיולים - חיפוש טיסות, מלונות וחבילות נופש",
  description: "מצאו את הטיסה, המלון או חבילת הנופש הבאה שלכם במחיר הטוב ביותר",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} font-sans min-h-screen`}>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pb-16">{children}</main>
        <footer className="text-center text-sm text-brand-700/60 py-8">
          נבנה לשימוש אישי · המחירים להמחשה בלבד כאשר אין חיבור ל-API חי
        </footer>
      </body>
    </html>
  );
}

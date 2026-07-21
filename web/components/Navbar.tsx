"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "בית" },
  { href: "/flights", label: "טיסות" },
  { href: "/hotels", label: "מלונות" },
  { href: "/packages", label: "חבילות נופש" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white/80 backdrop-blur border-b border-brand-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2 overflow-hidden">
        <Link href="/" className="flex items-center gap-1.5 shrink-0 text-brand-800 font-bold text-lg sm:text-xl">
          <span className="text-2xl">✈️</span>
          <span className="hidden sm:inline">טיולים</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-thin min-w-0">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 px-2.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  active ? "bg-brand-500 text-white" : "text-brand-800 hover:bg-brand-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

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
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-800 font-bold text-xl">
          <span className="text-2xl">✈️</span>
          <span>טיולים</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

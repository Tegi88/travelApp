import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS } from "@travel-app/shared";

const CATEGORIES = [
  { href: "/flights", icon: "✈️", title: "טיסות זולות", desc: "מצאו את הטיסה המשתלמת ביותר ליעד הבא שלכם" },
  { href: "/hotels", icon: "🏨", title: "מלונות ונופשים", desc: "בארץ ובחו״ל, במחיר ובדירוג שמתאימים לכם" },
  { href: "/packages", icon: "🧳", title: "חבילות נופש", desc: "טיסה + מלון במחיר מאוחד ומשתלם" },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="pt-14 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-900 leading-tight">
          התחילו את הטיול הבא שלכם
        </h1>
        <p className="text-brand-700/70 mt-3 text-lg">טיסות, מלונות וחבילות נופש - הכל במקום אחד</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all p-6 text-center"
          >
            <div className="text-4xl">{c.icon}</div>
            <h2 className="font-bold text-brand-900 text-xl mt-3">{c.title}</h2>
            <p className="text-brand-700/70 text-sm mt-1">{c.desc}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-brand-900 mb-4">יעדים פופולריים</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DESTINATIONS.filter((d) => d.popular).map((d) => (
            <Link
              key={d.id}
              href={`/flights?destination=${d.airportCode}`}
              className="relative rounded-2xl overflow-hidden h-40 group"
            >
              <Image
                src={d.imageUrl}
                alt={d.city}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 right-3 text-white">
                <div className="font-bold">{d.city}</div>
                <div className="text-xs opacity-80">{d.country}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

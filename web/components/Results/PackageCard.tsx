import Image from "next/image";
import { VacationPackage } from "@travel-app/shared";
import { formatPrice, formatDate, stopsLabel } from "@travel-app/shared";
import { Stars } from "../ui/Stars";

export function PackageCard({
  pkg,
  selected,
  onToggleCompare,
}: {
  pkg: VacationPackage;
  selected?: boolean;
  onToggleCompare?: (id: string) => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row ${
        selected ? "border-brand-500 ring-2 ring-brand-100" : "border-brand-100"
      }`}
    >
      <div className="relative w-full md:w-56 h-44 md:h-auto shrink-0">
        <Image src={pkg.imageUrl} alt={pkg.destinationCity} fill sizes="224px" className="object-cover" unoptimized />
        <span className="absolute top-2 right-2 bg-white/90 text-brand-800 text-xs font-bold rounded-full px-2 py-1">
          {pkg.nights} לילות
        </span>
      </div>
      <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-brand-900">
            {pkg.destinationCity}, {pkg.destinationCountry}
          </h3>
          <p className="text-xs text-brand-700/60 mt-0.5">
            {formatDate(pkg.departureDate)} - {formatDate(pkg.returnDate)}
          </p>
          <div className="mt-2 text-sm text-brand-800 space-y-1">
            <div className="flex items-center gap-2">
              <span>✈️</span>
              <span>
                {pkg.flight.airlineName} · {stopsLabel(pkg.flight.outbound.stops)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏨</span>
              <span className="flex items-center gap-1">
                {pkg.hotel.name} <Stars count={pkg.hotel.starRating} />
              </span>
            </div>
          </div>
          {onToggleCompare && (
            <label className="flex items-center gap-2 mt-3 text-sm text-brand-700">
              <input type="checkbox" checked={!!selected} onChange={() => onToggleCompare(pkg.id)} className="accent-brand-500" />
              הוסיפו להשוואה
            </label>
          )}
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:w-44 shrink-0 md:border-r md:border-brand-50 md:pr-4">
          {pkg.price.savingsVsSeparate > 0 && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 rounded-full px-2 py-0.5">
              חסכון {formatPrice(pkg.price.savingsVsSeparate, pkg.price.currency)}
            </span>
          )}
          <div className="text-left md:text-right">
            <div className="text-2xl font-extrabold text-brand-700">{formatPrice(pkg.price.perPerson, pkg.price.currency)}</div>
            <div className="text-xs text-brand-700/50">לאדם · סה"כ {formatPrice(pkg.price.total, pkg.price.currency)}</div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <a
              href={pkg.flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              הזמנת טיסה ↗
            </a>
            <a
              href={pkg.hotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-white border border-brand-500 text-brand-600 hover:bg-brand-50 text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              הזמנת מלון ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

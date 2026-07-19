import Image from "next/image";
import { HotelOffer } from "@travel-app/shared";
import { formatPrice } from "@travel-app/shared";
import { Stars, GuestRatingBadge } from "../ui/Stars";

export function HotelCard({ hotel }: { hotel: HotelOffer }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
      <div className="relative w-full md:w-56 h-44 md:h-auto shrink-0">
        <Image src={hotel.imageUrl} alt={hotel.name} fill sizes="224px" className="object-cover" unoptimized />
      </div>
      <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-brand-900">{hotel.name}</h3>
            <Stars count={hotel.starRating} />
          </div>
          <p className="text-sm text-brand-700/70 mt-0.5">{hotel.address}</p>
          <p className="text-sm text-brand-800 mt-1">{hotel.roomType}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a.code} className="text-xs bg-brand-50 text-brand-700 rounded-full px-2 py-0.5">
                {a.label}
              </span>
            ))}
          </div>
          {(hotel.breakfastIncluded || hotel.freeCancellation) && (
            <div className="flex gap-3 mt-2 text-xs text-green-700 font-medium">
              {hotel.breakfastIncluded && <span>✓ כולל ארוחת בוקר</span>}
              {hotel.freeCancellation && <span>✓ ביטול חינם</span>}
            </div>
          )}
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:w-40 shrink-0 md:border-r md:border-brand-50 md:pr-4">
          <GuestRatingBadge rating={hotel.guestRating} reviewCount={hotel.reviewCount} />
          <div className="text-left md:text-right">
            <div className="text-2xl font-extrabold text-brand-700">{formatPrice(hotel.price.perNight, hotel.price.currency)}</div>
            <div className="text-xs text-brand-700/50">ללילה · סה"כ {formatPrice(hotel.price.total, hotel.price.currency)}</div>
          </div>
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            הזמנה ב-Booking.com ↗
          </a>
        </div>
      </div>
    </div>
  );
}

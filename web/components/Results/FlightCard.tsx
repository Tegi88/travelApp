import { FlightOffer } from "@travel-app/shared";
import { formatDuration, formatPrice, formatTime, stopsLabel } from "@travel-app/shared";

function ItineraryRow({ itinerary, label }: { itinerary: FlightOffer["outbound"]; label: string }) {
  const first = itinerary.segments[0];
  const last = itinerary.segments[itinerary.segments.length - 1];
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-xs text-brand-700/60 w-10 shrink-0">{label}</span>
      <div className="text-center">
        <div className="font-bold text-brand-900">{formatTime(first.departureTime)}</div>
        <div className="text-xs text-brand-700/60">{first.departureAirport}</div>
      </div>
      <div className="flex-1 flex flex-col items-center px-2">
        <span className="text-xs text-brand-700/60">{formatDuration(itinerary.durationMinutes)}</span>
        <div className="w-full h-px bg-brand-200 relative my-1">
          <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-brand-400" />
          <span className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-brand-400" />
        </div>
        <span className="text-xs text-brand-500 font-medium">{stopsLabel(itinerary.stops)}</span>
      </div>
      <div className="text-center">
        <div className="font-bold text-brand-900">{formatTime(last.arrivalTime)}</div>
        <div className="text-xs text-brand-700/60">{last.arrivalAirport}</div>
      </div>
    </div>
  );
}

export function FlightCard({ offer }: { offer: FlightOffer }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 divide-y divide-brand-50">
        <ItineraryRow itinerary={offer.outbound} label="הלוך" />
        {offer.inbound && <ItineraryRow itinerary={offer.inbound} label="חזור" />}
      </div>
      <div className="md:w-40 shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:border-r md:border-brand-50 md:pr-4">
        <div className="text-xs text-brand-700/60">{offer.airlineName}</div>
        <div className="text-2xl font-extrabold text-brand-700">{formatPrice(offer.price.perPerson, offer.price.currency)}</div>
        <div className="text-xs text-brand-700/50">לנוסע</div>
        <a
          href={offer.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
        >
          הזמנה ב-Google Flights ↗
        </a>
      </div>
    </div>
  );
}

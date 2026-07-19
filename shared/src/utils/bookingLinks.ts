// Deep links into real, live booking sites so a search result can actually be
// booked. No API key/partnership required - these are the same public search
// URL formats the sites themselves generate when a person searches manually.
//
// NOTE: Google Flights' "q" parameter is parsed as natural language, and the
// exact phrasing matters a lot - verified each of these manually in a browser:
//   - round-trip: "Flights to X from Y on DATE through DATE" -> real results
//   - one-way:    "Flights to X from Y on DATE" (no "through") silently falls
//                 back to the generic homepage instead of the route search;
//                 "One-way flight to X from Y on DATE" works correctly.
//   - appending extra text (e.g. "for 2 people") also breaks the parser and
//     falls back to the homepage, so keep the query minimal either way.
export function buildGoogleFlightsUrl(params: {
  originCityEn: string;
  destinationCityEn: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
}): string {
  const query = params.returnDate
    ? `Flights to ${params.destinationCityEn} from ${params.originCityEn} on ${params.departureDate} through ${params.returnDate}`
    : `One-way flight to ${params.destinationCityEn} from ${params.originCityEn} on ${params.departureDate}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
}

export function buildBookingHotelUrl(params: {
  cityEn: string;
  hotelName?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults: number;
  rooms?: number;
}): string {
  const query = params.hotelName ? `${params.hotelName} ${params.cityEn}` : params.cityEn;
  const qs = new URLSearchParams({
    ss: query,
    checkin: params.checkInDate,
    checkout: params.checkOutDate,
    group_adults: String(params.adults),
    no_rooms: String(params.rooms ?? 1),
  });
  return `https://www.booking.com/searchresults.html?${qs.toString()}`;
}

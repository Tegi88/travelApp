import { FlightOffer, FlightSearchParams, FlightSegment, FlightItinerary } from "../../types/flight";
import { AIRLINES, DESTINATIONS, HOME_AIRPORT, airportCityEn } from "../../constants/destinations";
import { hashSeed, mulberry32, pick, randInt } from "../../utils/random";
import { buildGoogleFlightsUrl } from "../../utils/bookingLinks";

function cityForAirport(code: string): string {
  const dest = DESTINATIONS.find((d) => d.airportCode === code);
  if (dest) return dest.city;
  if (code === HOME_AIRPORT) return "תל אביב";
  return code;
}

function buildSegment(
  rng: () => number,
  fromCode: string,
  toCode: string,
  date: string,
  startHour: number
): FlightSegment {
  const airline = pick(rng, AIRLINES);
  const durationMinutes = randInt(rng, 120, 480);
  const minute = String(randInt(rng, 0, 5) * 10).padStart(2, "0");
  const departureTime = new Date(`${date}T${String(startHour).padStart(2, "0")}:${minute}:00`);
  const arrivalTime = new Date(departureTime.getTime() + durationMinutes * 60000);
  return {
    departureAirport: fromCode,
    departureCity: cityForAirport(fromCode),
    arrivalAirport: toCode,
    arrivalCity: cityForAirport(toCode),
    departureTime: departureTime.toISOString(),
    arrivalTime: arrivalTime.toISOString(),
    flightNumber: `${airline.code}${randInt(rng, 100, 999)}`,
    airlineCode: airline.code,
    airlineName: airline.name,
    durationMinutes,
  };
}

function buildItinerary(
  rng: () => number,
  fromCode: string,
  toCode: string,
  date: string,
  maxStops: number
): FlightItinerary {
  const stops = Math.min(randInt(rng, 0, 2), maxStops < 0 ? 2 : maxStops);
  const segments: FlightSegment[] = [];
  let currentFrom = fromCode;
  let startHour = randInt(rng, 5, 20);
  const hubCodes = ["IST", "ATH", "AMS", "FRA"];

  if (stops === 0) {
    segments.push(buildSegment(rng, currentFrom, toCode, date, startHour));
  } else {
    for (let i = 0; i < stops; i++) {
      const hub = pick(rng, hubCodes.filter((h) => h !== toCode && h !== currentFrom));
      segments.push(buildSegment(rng, currentFrom, hub, date, startHour));
      currentFrom = hub;
      startHour = randInt(rng, 6, 22);
    }
    segments.push(buildSegment(rng, currentFrom, toCode, date, startHour));
  }

  const durationMinutes = segments.reduce((sum, s) => sum + s.durationMinutes, 0) + stops * randInt(rng, 45, 180);
  return { segments, durationMinutes, stops };
}

export function generateMockFlights(params: FlightSearchParams): FlightOffer[] {
  const seedBase = `${params.originCode}-${params.destinationCode}-${params.departureDate}-${params.returnDate ?? "oneway"}`;
  const count = 8;
  const offers: FlightOffer[] = [];

  for (let i = 0; i < count; i++) {
    const rng = mulberry32(hashSeed(`${seedBase}-${i}`));
    const maxStopsAllowed = params.maxStops ?? -1;
    const outbound = buildItinerary(rng, params.originCode, params.destinationCode, params.departureDate, maxStopsAllowed);
    const inbound = params.returnDate
      ? buildItinerary(rng, params.destinationCode, params.originCode, params.returnDate, maxStopsAllowed)
      : undefined;

    const basePrice = randInt(rng, 180, 950) + outbound.stops * 40;
    const totalPrice = params.returnDate ? basePrice * 1.8 : basePrice;
    const perPerson = Math.round(totalPrice);
    const airline = outbound.segments[0];

    const offer: FlightOffer = {
      id: `fl-${seedBase}-${i}`,
      outbound,
      inbound,
      price: {
        total: Math.round(perPerson * params.adults),
        currency: params.currency ?? "USD",
        perPerson,
      },
      cabinClass: params.cabinClass ?? "ECONOMY",
      airlineCode: airline.airlineCode,
      airlineName: airline.airlineName,
      seatsAvailable: randInt(rng, 1, 9),
      bookingUrl: buildGoogleFlightsUrl({
        originCityEn: airportCityEn(params.originCode),
        destinationCityEn: airportCityEn(params.destinationCode),
        departureDate: params.departureDate,
        returnDate: params.returnDate,
      }),
    };
    offers.push(offer);
  }

  let filtered = offers;
  if (params.maxPrice) filtered = filtered.filter((o) => o.price.perPerson <= params.maxPrice!);
  if (params.maxStops !== undefined) filtered = filtered.filter((o) => o.outbound.stops <= params.maxStops!);
  if (params.airlineCodes && params.airlineCodes.length > 0) {
    filtered = filtered.filter((o) => params.airlineCodes!.includes(o.airlineCode));
  }

  return filtered.sort((a, b) => a.price.perPerson - b.price.perPerson);
}

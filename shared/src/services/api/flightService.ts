import { FlightOffer, FlightSearchParams, FlightSegment, FlightItinerary } from "../../types/flight";
import { ApiResult } from "../../types/common";
import { isAmadeusConfigured } from "./config";
import { amadeusGet } from "./amadeusClient";
import { generateMockFlights } from "../mock/mockFlights";
import { buildGoogleFlightsUrl } from "../../utils/bookingLinks";
import { airportCityEn } from "../../constants/destinations";

function mapAmadeusSegment(seg: any): FlightSegment {
  return {
    departureAirport: seg.departure.iataCode,
    departureCity: seg.departure.iataCode,
    arrivalAirport: seg.arrival.iataCode,
    arrivalCity: seg.arrival.iataCode,
    departureTime: seg.departure.at,
    arrivalTime: seg.arrival.at,
    flightNumber: `${seg.carrierCode}${seg.number}`,
    airlineCode: seg.carrierCode,
    airlineName: seg.carrierCode,
    durationMinutes: parseIsoDurationMinutes(seg.duration),
  };
}

function parseIsoDurationMinutes(iso: string | undefined): number {
  if (!iso) return 0;
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso);
  const hours = match?.[1] ? parseInt(match[1], 10) : 0;
  const mins = match?.[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + mins;
}

function mapAmadeusItinerary(itin: any): FlightItinerary {
  const segments = (itin.segments ?? []).map(mapAmadeusSegment);
  return {
    segments,
    durationMinutes: parseIsoDurationMinutes(itin.duration),
    stops: Math.max(0, segments.length - 1),
  };
}

function mapAmadeusOffer(offer: any, params: FlightSearchParams): FlightOffer {
  const itineraries = offer.itineraries ?? [];
  const outbound = mapAmadeusItinerary(itineraries[0] ?? {});
  const inbound = itineraries[1] ? mapAmadeusItinerary(itineraries[1]) : undefined;
  const total = parseFloat(offer.price?.total ?? "0");
  return {
    id: offer.id,
    outbound,
    inbound,
    price: {
      total,
      currency: offer.price?.currency ?? "USD",
      perPerson: Math.round(total / params.adults),
    },
    cabinClass: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ?? "ECONOMY",
    airlineCode: outbound.segments[0]?.airlineCode ?? "",
    airlineName: outbound.segments[0]?.airlineName ?? "",
    seatsAvailable: offer.numberOfBookableSeats,
    bookingUrl: buildGoogleFlightsUrl({
      originCityEn: airportCityEn(params.originCode),
      destinationCityEn: airportCityEn(params.destinationCode),
      departureDate: params.departureDate,
      returnDate: params.returnDate,
    }),
  };
}

async function searchFlightsLive(params: FlightSearchParams): Promise<FlightOffer[]> {
  const json = await amadeusGet<{ data: any[] }>("/v2/shopping/flight-offers", {
    originLocationCode: params.originCode,
    destinationLocationCode: params.destinationCode,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: params.adults,
    travelClass: params.cabinClass,
    maxPrice: params.maxPrice,
    currencyCode: params.currency ?? "USD",
    max: 20,
  });

  let offers = (json.data ?? []).map((o) => mapAmadeusOffer(o, params));
  if (params.maxStops !== undefined) offers = offers.filter((o) => o.outbound.stops <= params.maxStops!);
  if (params.airlineCodes?.length) offers = offers.filter((o) => params.airlineCodes!.includes(o.airlineCode));
  return offers.sort((a, b) => a.price.perPerson - b.price.perPerson);
}

export async function searchFlights(params: FlightSearchParams): Promise<ApiResult<FlightOffer[]>> {
  if (isAmadeusConfigured()) {
    try {
      const data = await searchFlightsLive(params);
      if (data.length > 0) {
        return { data, source: "live", fetchedAt: new Date().toISOString() };
      }
    } catch (err) {
      // Fall through to mock data below; real API is best-effort.
      console.warn("[flightService] live search failed, using mock data:", (err as Error).message);
    }
  }

  return {
    data: generateMockFlights(params),
    source: "mock",
    fetchedAt: new Date().toISOString(),
  };
}

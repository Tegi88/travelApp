import { CabinClass } from "./common";

export interface FlightSegment {
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  departureTime: string; // ISO 8601
  arrivalTime: string; // ISO 8601
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  durationMinutes: number;
}

export interface FlightItinerary {
  segments: FlightSegment[];
  durationMinutes: number;
  stops: number;
}

export interface FlightOffer {
  id: string;
  outbound: FlightItinerary;
  inbound?: FlightItinerary;
  price: {
    total: number;
    currency: string;
    perPerson: number;
  };
  cabinClass: CabinClass;
  airlineCode: string;
  airlineName: string;
  seatsAvailable?: number;
  bookingUrl?: string;
}

export interface FlightSearchParams {
  originCode: string;
  destinationCode: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD, omit for one-way
  adults: number;
  cabinClass?: CabinClass;
  maxPrice?: number;
  maxStops?: number;
  airlineCodes?: string[];
  currency?: string;
}

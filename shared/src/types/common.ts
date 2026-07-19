export type CabinClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export interface Airport {
  code: string; // IATA code, e.g. "TLV"
  city: string;
  country: string;
  name: string;
}

export interface Destination {
  id: string;
  city: string;
  cityEn: string; // English name, used for real booking-site deep links (Booking.com search, etc.)
  country: string;
  airportCode: string;
  imageUrl: string;
  popular?: boolean;
  description?: string;
}

export interface ApiResult<T> {
  data: T;
  source: "live" | "mock";
  fetchedAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

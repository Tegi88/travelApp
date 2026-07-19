import { FlightOffer } from "./flight";
import { HotelOffer } from "./hotel";

export interface VacationPackage {
  id: string;
  destinationCity: string;
  destinationCountry: string;
  destinationCode: string;
  imageUrl: string;
  flight: FlightOffer;
  hotel: HotelOffer;
  nights: number;
  price: {
    total: number;
    perPerson: number;
    currency: string;
    savingsVsSeparate: number;
  };
  departureDate: string;
  returnDate: string;
}

export interface PackageSearchParams {
  originCode: string;
  destinationCode?: string; // omit to search all popular destinations
  departureDate: string;
  returnDate: string;
  adults: number;
  maxBudget?: number;
  minHotelStars?: number;
  currency?: string;
}

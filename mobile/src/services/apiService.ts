// Mobile hits the travel provider APIs directly (via the shared service layer),
// with the same mock-data fallback used on web when no API keys are configured
// or the live request fails.
import {
  searchFlights,
  searchHotels,
  searchPackages,
  FlightSearchParams,
  HotelSearchParams,
  PackageSearchParams,
} from "@travel-app/shared";

export const apiService = {
  searchFlights: (params: FlightSearchParams) => searchFlights(params),
  searchHotels: (params: HotelSearchParams) => searchHotels(params),
  searchPackages: (params: PackageSearchParams) => searchPackages(params),
};

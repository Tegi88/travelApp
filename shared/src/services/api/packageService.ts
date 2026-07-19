import { VacationPackage, PackageSearchParams } from "../../types/package";
import { ApiResult } from "../../types/common";
import { DESTINATIONS } from "../../constants/destinations";
import { searchFlights } from "./flightService";
import { searchHotels } from "./hotelService";
import { generateMockPackages } from "../mock/mockPackages";
import { nightsBetween } from "../../utils/formatters";

async function searchPackagesLive(params: PackageSearchParams): Promise<VacationPackage[]> {
  const targets = params.destinationCode
    ? DESTINATIONS.filter((d) => d.airportCode === params.destinationCode)
    : DESTINATIONS.filter((d) => d.popular).slice(0, 6);

  const nights = nightsBetween(params.departureDate, params.returnDate);
  const currency = params.currency ?? "USD";
  const packages: VacationPackage[] = [];

  for (const dest of targets) {
    const [flightResult, hotelResult] = await Promise.all([
      searchFlights({
        originCode: params.originCode,
        destinationCode: dest.airportCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        currency,
      }),
      searchHotels({
        destinationCode: dest.airportCode,
        destinationCity: dest.city,
        destinationCityEn: dest.cityEn,
        checkInDate: params.departureDate,
        checkOutDate: params.returnDate,
        adults: params.adults,
        minStarRating: params.minHotelStars,
        currency,
      }),
    ]);

    // Only trust the combination as "live" when both legs came back from the real API.
    if (flightResult.source !== "live" || hotelResult.source !== "live") continue;
    const flight = flightResult.data[0];
    const hotel = hotelResult.data[0];
    if (!flight || !hotel) continue;

    const separateTotal = flight.price.total + hotel.price.total;
    const bundleTotal = Math.round(separateTotal * 0.9);

    packages.push({
      id: `pkg-${dest.id}-${params.departureDate}`,
      destinationCity: dest.city,
      destinationCountry: dest.country,
      destinationCode: dest.airportCode,
      imageUrl: dest.imageUrl,
      flight,
      hotel,
      nights,
      price: {
        total: bundleTotal,
        perPerson: Math.round(bundleTotal / params.adults),
        currency,
        savingsVsSeparate: separateTotal - bundleTotal,
      },
      departureDate: params.departureDate,
      returnDate: params.returnDate,
    });
  }

  return packages.sort((a, b) => a.price.perPerson - b.price.perPerson);
}

export async function searchPackages(params: PackageSearchParams): Promise<ApiResult<VacationPackage[]>> {
  try {
    const data = await searchPackagesLive(params);
    if (data.length > 0) {
      return { data, source: "live", fetchedAt: new Date().toISOString() };
    }
  } catch (err) {
    console.warn("[packageService] live search failed, using mock data:", (err as Error).message);
  }

  return {
    data: generateMockPackages(params),
    source: "mock",
    fetchedAt: new Date().toISOString(),
  };
}

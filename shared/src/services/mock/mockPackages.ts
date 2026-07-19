import { VacationPackage, PackageSearchParams } from "../../types/package";
import { DESTINATIONS } from "../../constants/destinations";
import { generateMockFlights } from "./mockFlights";
import { generateMockHotels } from "./mockHotels";
import { nightsBetween } from "../../utils/formatters";

export function generateMockPackages(params: PackageSearchParams): VacationPackage[] {
  const targets = params.destinationCode
    ? DESTINATIONS.filter((d) => d.airportCode === params.destinationCode)
    : DESTINATIONS.filter((d) => d.popular);

  const nights = nightsBetween(params.departureDate, params.returnDate);
  const currency = params.currency ?? "USD";
  const packages: VacationPackage[] = [];

  for (const dest of targets) {
    const flights = generateMockFlights({
      originCode: params.originCode,
      destinationCode: dest.airportCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults,
      currency,
    });
    const hotels = generateMockHotels({
      destinationCode: dest.airportCode,
      destinationCity: dest.city,
      destinationCityEn: dest.cityEn,
      checkInDate: params.departureDate,
      checkOutDate: params.returnDate,
      adults: params.adults,
      minStarRating: params.minHotelStars,
      currency,
    });

    if (flights.length === 0 || hotels.length === 0) continue;

    // Build a couple of bundled options per destination: cheapest combo and a mid-tier combo
    const combos: [number, number][] = [
      [0, 0],
      [Math.min(1, flights.length - 1), Math.min(2, hotels.length - 1)],
    ];

    combos.forEach(([fIdx, hIdx], comboIdx) => {
      const flight = flights[fIdx];
      const hotel = hotels[hIdx];
      const separateTotal = flight.price.total + hotel.price.total;
      const bundleDiscount = 0.08 + (comboIdx === 0 ? 0.04 : 0);
      const bundleTotal = Math.round(separateTotal * (1 - bundleDiscount));

      packages.push({
        id: `pkg-${dest.id}-${params.departureDate}-${comboIdx}`,
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
    });
  }

  let filtered = packages;
  if (params.maxBudget) filtered = filtered.filter((p) => p.price.perPerson <= params.maxBudget!);

  return filtered.sort((a, b) => a.price.perPerson - b.price.perPerson);
}

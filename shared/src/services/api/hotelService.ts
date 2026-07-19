import { HotelOffer, HotelSearchParams } from "../../types/hotel";
import { ApiResult } from "../../types/common";
import { getApiConfig, isAmadeusConfigured } from "./config";
import { amadeusGet } from "./amadeusClient";
import { generateMockHotels } from "../mock/mockHotels";
import { nightsBetween } from "../../utils/formatters";
import { buildBookingHotelUrl } from "../../utils/bookingLinks";

async function searchHotelsLive(params: HotelSearchParams): Promise<HotelOffer[]> {
  // Amadeus hotel search is a two-step lookup: hotels in a city, then live offers for those hotel IDs.
  const hotelList = await amadeusGet<{ data: any[] }>("/v1/reference-data/locations/hotels/by-city", {
    cityCode: params.destinationCode,
  });

  const hotelIds = (hotelList.data ?? []).slice(0, 20).map((h) => h.hotelId).join(",");
  if (!hotelIds) return [];

  const offersJson = await amadeusGet<{ data: any[] }>("/v3/shopping/hotel-offers", {
    hotelIds,
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: params.adults,
    roomQuantity: params.rooms ?? 1,
    currency: params.currency ?? "USD",
  });

  const nights = nightsBetween(params.checkInDate, params.checkOutDate);

  return (offersJson.data ?? []).map((entry): HotelOffer => {
    const hotel = entry.hotel ?? {};
    const offer = entry.offers?.[0] ?? {};
    const total = parseFloat(offer.price?.total ?? "0");
    return {
      id: entry.type === "hotel-offers" ? hotel.hotelId : offer.id,
      name: hotel.name ?? "Hotel",
      city: params.destinationCity,
      country: hotel.address?.countryCode ?? "",
      address: [hotel.address?.lines?.join(" "), hotel.address?.cityName].filter(Boolean).join(", "),
      starRating: hotel.rating ? parseInt(hotel.rating, 10) : 3,
      guestRating: 0,
      reviewCount: 0,
      imageUrl: `https://picsum.photos/seed/${hotel.hotelId ?? "hotel"}/800/600`,
      amenities: (hotel.amenities ?? []).slice(0, 6).map((a: string) => ({ code: a, label: a })),
      roomType: offer.room?.typeEstimated?.category ?? "Standard Room",
      price: { total, perNight: Math.round(total / nights), currency: offer.price?.currency ?? "USD" },
      nights,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      freeCancellation: Boolean(offer.policies?.cancellations?.length),
      breakfastIncluded: offer.boardType === "BREAKFAST",
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      bookingUrl: buildBookingHotelUrl({
        cityEn: params.destinationCityEn ?? params.destinationCity,
        hotelName: hotel.name,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        adults: params.adults,
        rooms: params.rooms,
      }),
    };
  });
}

export async function searchHotels(params: HotelSearchParams): Promise<ApiResult<HotelOffer[]>> {
  const cfg = getApiConfig();
  if (cfg.hotelProvider === "amadeus" && isAmadeusConfigured()) {
    try {
      const data = await searchHotelsLive(params);
      if (data.length > 0) {
        return { data, source: "live", fetchedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.warn("[hotelService] live search failed, using mock data:", (err as Error).message);
    }
  }

  return {
    data: generateMockHotels(params),
    source: "mock",
    fetchedAt: new Date().toISOString(),
  };
}

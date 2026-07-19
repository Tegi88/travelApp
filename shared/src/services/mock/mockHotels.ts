import { HotelOffer, HotelSearchParams, HotelAmenity } from "../../types/hotel";
import { hashSeed, mulberry32, pick, randInt } from "../../utils/random";
import { nightsBetween } from "../../utils/formatters";
import { buildBookingHotelUrl } from "../../utils/bookingLinks";

const HOTEL_NAME_PREFIXES = ["גראנד", "רויאל", "פארק", "פלאזה", "בוטיק", "רזורט", "פאלאס", "מרינה", "גארדן", "סנטרל"];
const HOTEL_NAME_SUFFIXES = ["הוטל", "סוויטס", "אינטרקונטיננטל", "רזידנס", "טאואר", "לגונה", "ביי"];

const ALL_AMENITIES: HotelAmenity[] = [
  { code: "wifi", label: "Wi-Fi חינם" },
  { code: "pool", label: "בריכה" },
  { code: "spa", label: "ספא" },
  { code: "gym", label: "חדר כושר" },
  { code: "parking", label: "חניה" },
  { code: "breakfast", label: "ארוחת בוקר" },
  { code: "beach", label: "גישה לחוף" },
  { code: "ac", label: "מיזוג אוויר" },
  { code: "pet", label: "מתאים לחיות מחמד" },
  { code: "bar", label: "בר" },
];

function pickAmenities(rng: () => number): HotelAmenity[] {
  const count = randInt(rng, 3, 7);
  const shuffled = [...ALL_AMENITIES].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMockHotels(params: HotelSearchParams): HotelOffer[] {
  const seedBase = `${params.destinationCode}-${params.destinationCity}-${params.checkInDate}-${params.checkOutDate}`;
  const nights = nightsBetween(params.checkInDate, params.checkOutDate);
  const count = 10;
  const offers: HotelOffer[] = [];

  for (let i = 0; i < count; i++) {
    const rng = mulberry32(hashSeed(`${seedBase}-${i}`));
    const starRating = randInt(rng, 2, 5);
    const perNight = randInt(rng, 45, 60) + starRating * randInt(rng, 25, 60);
    const guestRating = Math.round((6 + rng() * 3.8) * 10) / 10;
    const breakfastIncluded = rng() > 0.5;
    const freeCancellation = rng() > 0.4;

    offers.push({
      id: `htl-${seedBase}-${i}`,
      name: `${pick(rng, HOTEL_NAME_PREFIXES)} ${pick(rng, HOTEL_NAME_SUFFIXES)} ${params.destinationCity}`,
      city: params.destinationCity,
      country: "",
      address: `רחוב ${randInt(rng, 1, 200)}, ${params.destinationCity}`,
      starRating,
      guestRating,
      reviewCount: randInt(rng, 25, 3200),
      imageUrl: `https://picsum.photos/seed/hotel-${seedBase}-${i}/800/600`,
      images: [0, 1, 2].map((n) => `https://picsum.photos/seed/hotel-${seedBase}-${i}-${n}/800/600`),
      amenities: pickAmenities(rng),
      roomType: pick(rng, ["חדר זוגי סטנדרט", "חדר דלוקס", "סוויטה", "חדר עם נוף לים", "חדר משפחתי"]),
      price: {
        total: Math.round(perNight * nights),
        perNight,
        currency: params.currency ?? "USD",
      },
      nights,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      freeCancellation,
      breakfastIncluded,
      latitude: 40 + rng() * 10,
      longitude: 10 + rng() * 20,
      // Mock hotel names are invented, so link to a real city-wide search rather
      // than searching for a hotel name that doesn't exist on Booking.com.
      bookingUrl: buildBookingHotelUrl({
        cityEn: params.destinationCityEn ?? params.destinationCity,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        adults: params.adults,
        rooms: params.rooms,
      }),
    });
  }

  let filtered = offers;
  if (params.minStarRating) filtered = filtered.filter((h) => h.starRating >= params.minStarRating!);
  if (params.maxPricePerNight) filtered = filtered.filter((h) => h.price.perNight <= params.maxPricePerNight!);

  return filtered.sort((a, b) => a.price.perNight - b.price.perNight);
}

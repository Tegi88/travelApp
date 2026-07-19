export interface HotelAmenity {
  code: string;
  label: string;
}

export interface HotelOffer {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  starRating: number; // 1-5
  guestRating: number; // 0-10
  reviewCount: number;
  imageUrl: string;
  images?: string[];
  amenities: HotelAmenity[];
  roomType: string;
  price: {
    total: number;
    perNight: number;
    currency: string;
  };
  nights: number;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
  bookingUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface HotelSearchParams {
  destinationCode: string;
  destinationCity: string;
  destinationCityEn?: string; // English name, improves accuracy of the Booking.com deep link
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults: number;
  rooms?: number;
  minStarRating?: number;
  maxPricePerNight?: number;
  currency?: string;
}

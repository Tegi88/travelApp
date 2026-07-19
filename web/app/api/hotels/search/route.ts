import { NextRequest, NextResponse } from "next/server";
import { searchHotels, validateHotelSearch, HotelSearchParams } from "@travel-app/shared";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const params: Partial<HotelSearchParams> = {
    destinationCode: sp.get("destinationCode") || undefined,
    destinationCity: sp.get("destinationCity") || undefined,
    destinationCityEn: sp.get("destinationCityEn") || undefined,
    checkInDate: sp.get("checkInDate") || undefined,
    checkOutDate: sp.get("checkOutDate") || undefined,
    adults: sp.get("adults") ? Number(sp.get("adults")) : 1,
    rooms: sp.get("rooms") ? Number(sp.get("rooms")) : undefined,
    minStarRating: sp.get("minStarRating") ? Number(sp.get("minStarRating")) : undefined,
    maxPricePerNight: sp.get("maxPricePerNight") ? Number(sp.get("maxPricePerNight")) : undefined,
    currency: sp.get("currency") || undefined,
  };

  const errors = validateHotelSearch(params);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const result = await searchHotels(params as HotelSearchParams);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ errors: [(err as Error).message] }, { status: 500 });
  }
}

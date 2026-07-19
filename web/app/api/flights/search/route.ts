import { NextRequest, NextResponse } from "next/server";
import { searchFlights, validateFlightSearch, FlightSearchParams } from "@travel-app/shared";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const params: Partial<FlightSearchParams> = {
    originCode: sp.get("originCode") || undefined,
    destinationCode: sp.get("destinationCode") || undefined,
    departureDate: sp.get("departureDate") || undefined,
    returnDate: sp.get("returnDate") || undefined,
    adults: sp.get("adults") ? Number(sp.get("adults")) : 1,
    cabinClass: (sp.get("cabinClass") as FlightSearchParams["cabinClass"]) || undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    maxStops: sp.get("maxStops") ? Number(sp.get("maxStops")) : undefined,
    airlineCodes: sp.get("airlineCodes") ? sp.get("airlineCodes")!.split(",") : undefined,
    currency: sp.get("currency") || undefined,
  };

  const errors = validateFlightSearch(params);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const result = await searchFlights(params as FlightSearchParams);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ errors: [(err as Error).message] }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { searchPackages, validatePackageSearch, PackageSearchParams } from "@travel-app/shared";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const params: Partial<PackageSearchParams> = {
    originCode: sp.get("originCode") || undefined,
    destinationCode: sp.get("destinationCode") || undefined,
    departureDate: sp.get("departureDate") || undefined,
    returnDate: sp.get("returnDate") || undefined,
    adults: sp.get("adults") ? Number(sp.get("adults")) : 1,
    maxBudget: sp.get("maxBudget") ? Number(sp.get("maxBudget")) : undefined,
    minHotelStars: sp.get("minHotelStars") ? Number(sp.get("minHotelStars")) : undefined,
    currency: sp.get("currency") || undefined,
  };

  const errors = validatePackageSearch(params);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const result = await searchPackages(params as PackageSearchParams);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ errors: [(err as Error).message] }, { status: 500 });
  }
}

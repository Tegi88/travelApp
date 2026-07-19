import {
  ApiResult,
  FlightOffer,
  FlightSearchParams,
  HotelOffer,
  HotelSearchParams,
  VacationPackage,
  PackageSearchParams,
} from "@travel-app/shared";

async function get<T>(path: string, params: Record<string, unknown>): Promise<ApiResult<T>> {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");

  const res = await fetch(`${path}?${qs}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.join(", ") || "שגיאה בטעינת התוצאות");
  }
  return json as ApiResult<T>;
}

export function searchFlightsApi(params: Partial<FlightSearchParams>) {
  return get<FlightOffer[]>("/api/flights/search", params);
}

export function searchHotelsApi(params: Partial<HotelSearchParams>) {
  return get<HotelOffer[]>("/api/hotels/search", params);
}

export function searchPackagesApi(params: Partial<PackageSearchParams>) {
  return get<VacationPackage[]>("/api/packages/search", params);
}

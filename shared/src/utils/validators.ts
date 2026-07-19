import { FlightSearchParams } from "../types/flight";
import { HotelSearchParams } from "../types/hotel";
import { PackageSearchParams } from "../types/package";

export function validateFlightSearch(params: Partial<FlightSearchParams>): string[] {
  const errors: string[] = [];
  if (!params.originCode) errors.push("יש לבחור נמל תעופה מוצא");
  if (!params.destinationCode) errors.push("יש לבחור יעד");
  if (!params.departureDate) errors.push("יש לבחור תאריך יציאה");
  if (params.returnDate && params.departureDate && params.returnDate < params.departureDate) {
    errors.push("תאריך החזרה חייב להיות אחרי תאריך היציאה");
  }
  if (!params.adults || params.adults < 1) errors.push("יש לבחור לפחות מבוגר אחד");
  return errors;
}

export function validateHotelSearch(params: Partial<HotelSearchParams>): string[] {
  const errors: string[] = [];
  if (!params.destinationCity) errors.push("יש לבחור יעד");
  if (!params.checkInDate) errors.push("יש לבחור תאריך צ'ק-אין");
  if (!params.checkOutDate) errors.push("יש לבחור תאריך צ'ק-אאוט");
  if (params.checkInDate && params.checkOutDate && params.checkOutDate <= params.checkInDate) {
    errors.push("תאריך הצ'ק-אאוט חייב להיות אחרי הצ'ק-אין");
  }
  if (!params.adults || params.adults < 1) errors.push("יש לבחור לפחות אורח אחד");
  return errors;
}

export function validatePackageSearch(params: Partial<PackageSearchParams>): string[] {
  const errors: string[] = [];
  if (!params.originCode) errors.push("יש לבחור נמל תעופה מוצא");
  if (!params.departureDate) errors.push("יש לבחור תאריך יציאה");
  if (!params.returnDate) errors.push("יש לבחור תאריך חזרה");
  if (params.departureDate && params.returnDate && params.returnDate <= params.departureDate) {
    errors.push("תאריך החזרה חייב להיות אחרי תאריך היציאה");
  }
  if (!params.adults || params.adults < 1) errors.push("יש לבחור לפחות מבוגר אחד");
  return errors;
}

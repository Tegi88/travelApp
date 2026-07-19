export function formatPrice(amount: number, currency = "USD"): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "€", ILS: "₪", GBP: "£" };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${Math.round(amount).toLocaleString("he-IL")}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}ש ${m}ד` : `${h}ש`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function stopsLabel(stops: number): string {
  if (stops === 0) return "ישירה";
  if (stops === 1) return "עצירה אחת";
  return `${stops} עצירות`;
}

// Local-calendar-day YYYY-MM-DD, NOT UTC. `Date#toISOString()` reads UTC, which
// rolls back to the previous calendar day for part of the day in any timezone
// ahead of UTC (e.g. Israel) - a default "today" search date computed that way
// silently points at yesterday and returns no results.
export function todayLocalIso(): string {
  return toLocalIso(new Date());
}

export function addDaysLocalIso(days: number, fromIso?: string): string {
  const base = fromIso ? new Date(`${fromIso}T00:00:00`) : new Date();
  base.setDate(base.getDate() + days);
  return toLocalIso(base);
}

function toLocalIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

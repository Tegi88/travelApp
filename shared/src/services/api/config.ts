// Reads the same logical env var under whichever prefix the current runtime exposes
// (plain on Node/Next.js server routes, EXPO_PUBLIC_/NEXT_PUBLIC_ on client bundles).
function readEnv(name: string): string | undefined {
  const env = (typeof process !== "undefined" ? process.env : {}) as Record<string, string | undefined>;
  return env[name] ?? env[`EXPO_PUBLIC_${name}`] ?? env[`NEXT_PUBLIC_${name}`];
}

export interface ApiConfig {
  amadeusClientId?: string;
  amadeusClientSecret?: string;
  amadeusBaseUrl: string;
  hotelProvider: "amadeus" | "none";
  defaultCurrency: string;
}

export function getApiConfig(): ApiConfig {
  return {
    amadeusClientId: readEnv("AMADEUS_CLIENT_ID"),
    amadeusClientSecret: readEnv("AMADEUS_CLIENT_SECRET"),
    amadeusBaseUrl: readEnv("AMADEUS_BASE_URL") || "https://test.api.amadeus.com",
    hotelProvider: (readEnv("HOTEL_PROVIDER") as "amadeus" | "none") || "amadeus",
    defaultCurrency: readEnv("DEFAULT_CURRENCY") || "USD",
  };
}

export function isAmadeusConfigured(): boolean {
  const cfg = getApiConfig();
  return Boolean(cfg.amadeusClientId && cfg.amadeusClientSecret);
}

import { getApiConfig } from "./config";
import { ApiError } from "../../types/common";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const cfg = getApiConfig();
  if (!cfg.amadeusClientId || !cfg.amadeusClientSecret) {
    throw new ApiClientError("Amadeus API credentials are not configured", "NO_CREDENTIALS");
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 5000) {
    return cachedToken.value;
  }

  const res = await fetch(`${cfg.amadeusBaseUrl}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: cfg.amadeusClientId,
      client_secret: cfg.amadeusClientSecret,
    }).toString(),
  });

  if (!res.ok) {
    throw new ApiClientError(`Amadeus auth failed: ${res.status}`, "AUTH_FAILED", res.status);
  }

  const json = await res.json();
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return cachedToken.value;
}

export class ApiClientError extends Error implements ApiError {
  code?: string;
  status?: number;
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}

export async function amadeusGet<T>(path: string, query: Record<string, string | number | undefined>): Promise<T> {
  const cfg = getApiConfig();
  const token = await getAccessToken();
  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");

  const res = await fetch(`${cfg.amadeusBaseUrl}${path}?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiClientError(`Amadeus request failed: ${res.status} ${body}`, "REQUEST_FAILED", res.status);
  }

  return res.json();
}

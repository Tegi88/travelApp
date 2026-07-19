"use client";

import { useMemo, useState } from "react";
import { FlightOffer } from "@travel-app/shared";
import { FlightSearchForm, FlightFormState } from "@/components/SearchForms/FlightSearchForm";
import { FlightFilters, FlightFilterState } from "@/components/Filters/FlightFilters";
import { FlightCard } from "@/components/Results/FlightCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusMessage";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { searchFlightsApi } from "@/lib/apiClient";

export default function FlightsPage() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [source, setSource] = useState<"live" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<FlightFilterState>({ maxPrice: null, maxStops: null, airlineCodes: [] });

  async function handleSearch(state: FlightFormState) {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await searchFlightsApi({
        originCode: state.originCode,
        destinationCode: state.destinationCode,
        departureDate: state.departureDate,
        returnDate: state.returnDate || undefined,
        adults: state.adults,
        cabinClass: state.cabinClass,
      });
      setOffers(result.data);
      setSource(result.source);
      setFilters({ maxPrice: null, maxStops: null, airlineCodes: [] });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const priceBounds: [number, number] = useMemo(() => {
    if (offers.length === 0) return [0, 1000];
    const prices = offers.map((o) => o.price.perPerson);
    return [Math.min(...prices), Math.max(...prices)];
  }, [offers]);

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (filters.maxPrice !== null && o.price.perPerson > filters.maxPrice) return false;
      if (filters.maxStops !== null && o.outbound.stops > filters.maxStops) return false;
      if (filters.airlineCodes.length > 0 && !filters.airlineCodes.includes(o.airlineCode)) return false;
      return true;
    });
  }, [offers, filters]);

  return (
    <div className="pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-brand-900">חיפוש טיסות זולות</h1>
      <FlightSearchForm onSearch={handleSearch} loading={loading} />

      {loading && <LoadingState label="מחפש טיסות..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && searched && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-brand-700/70 text-sm">{filtered.length} טיסות נמצאו</span>
            {source && <SourceBadge source={source} />}
          </div>
          {filtered.length === 0 ? (
            <EmptyState message="לא נמצאו טיסות התואמות את החיפוש. נסו לשנות את הפילטרים." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
              <FlightFilters filters={filters} onChange={setFilters} priceBounds={priceBounds} />
              <div className="flex flex-col gap-3">
                {filtered.map((offer) => (
                  <FlightCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

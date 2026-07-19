"use client";

import { useMemo, useState } from "react";
import { HotelOffer, ALL_DESTINATIONS } from "@travel-app/shared";
import { HotelSearchForm, HotelFormState } from "@/components/SearchForms/HotelSearchForm";
import { HotelFilters, HotelFilterState } from "@/components/Filters/HotelFilters";
import { HotelCard } from "@/components/Results/HotelCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusMessage";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { searchHotelsApi } from "@/lib/apiClient";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [source, setSource] = useState<"live" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<HotelFilterState>({ minStarRating: null, maxPricePerNight: null });

  async function handleSearch(state: HotelFormState) {
    const dest = ALL_DESTINATIONS.find((d) => d.id === state.destinationId)!;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await searchHotelsApi({
        destinationCode: dest.airportCode || dest.id,
        destinationCity: dest.city,
        destinationCityEn: dest.cityEn,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        adults: state.adults,
        rooms: state.rooms,
      });
      setHotels(result.data);
      setSource(result.source);
      setFilters({ minStarRating: null, maxPricePerNight: null });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const priceBounds: [number, number] = useMemo(() => {
    if (hotels.length === 0) return [0, 1000];
    const prices = hotels.map((h) => h.price.perNight);
    return [Math.min(...prices), Math.max(...prices)];
  }, [hotels]);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (filters.minStarRating !== null && h.starRating < filters.minStarRating) return false;
      if (filters.maxPricePerNight !== null && h.price.perNight > filters.maxPricePerNight) return false;
      return true;
    });
  }, [hotels, filters]);

  return (
    <div className="pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-brand-900">חיפוש מלונות ונופשים</h1>
      <HotelSearchForm onSearch={handleSearch} loading={loading} />

      {loading && <LoadingState label="מחפש מלונות..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && searched && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-brand-700/70 text-sm">{filtered.length} מלונות נמצאו</span>
            {source && <SourceBadge source={source} />}
          </div>
          {filtered.length === 0 ? (
            <EmptyState message="לא נמצאו מלונות התואמים את החיפוש. נסו לשנות את הפילטרים." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
              <HotelFilters filters={filters} onChange={setFilters} priceBounds={priceBounds} />
              <div className="flex flex-col gap-3">
                {filtered.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

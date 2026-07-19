"use client";

import { useState } from "react";
import { VacationPackage } from "@travel-app/shared";
import { PackageSearchForm, PackageFormState } from "@/components/SearchForms/PackageSearchForm";
import { PackageCard } from "@/components/Results/PackageCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusMessage";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { searchPackagesApi } from "@/lib/apiClient";
import { formatPrice } from "@travel-app/shared";

export default function PackagesPage() {
  const [packages, setPackages] = useState<VacationPackage[]>([]);
  const [source, setSource] = useState<"live" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  async function handleSearch(state: PackageFormState) {
    setLoading(true);
    setError(null);
    setSearched(true);
    setCompareIds([]);
    try {
      const result = await searchPackagesApi({
        originCode: state.originCode,
        destinationCode: state.destinationCode || undefined,
        departureDate: state.departureDate,
        returnDate: state.returnDate,
        adults: state.adults,
        maxBudget: state.maxBudget ? Number(state.maxBudget) : undefined,
      });
      setPackages(result.data);
      setSource(result.source);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) return prev; // limit comparison to 3 packages
      return [...prev, id];
    });
  }

  const compared = packages.filter((p) => compareIds.includes(p.id));

  return (
    <div className="pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-brand-900">חבילות נופש - טיסה + מלון</h1>
      <PackageSearchForm onSearch={handleSearch} loading={loading} />

      {loading && <LoadingState label="מחפש חבילות נופש..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && searched && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-brand-700/70 text-sm">{packages.length} חבילות נמצאו · בחרו עד 3 להשוואה</span>
            {source && <SourceBadge source={source} />}
          </div>

          {compared.length > 1 && (
            <div className="bg-white rounded-2xl border border-brand-200 shadow-sm p-4 overflow-x-auto scrollbar-thin">
              <h3 className="font-bold text-brand-900 mb-3">השוואת חבילות</h3>
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="text-brand-700/60 text-right">
                    <th className="py-2">יעד</th>
                    <th>מלון</th>
                    <th>טיסה</th>
                    <th>מחיר לאדם</th>
                  </tr>
                </thead>
                <tbody>
                  {compared.map((p) => (
                    <tr key={p.id} className="border-t border-brand-50">
                      <td className="py-2 font-medium text-brand-900">{p.destinationCity}</td>
                      <td>
                        {p.hotel.name} ({p.hotel.starRating}★)
                      </td>
                      <td>{p.flight.airlineName}</td>
                      <td className="font-bold text-brand-700">{formatPrice(p.price.perPerson, p.price.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {packages.length === 0 ? (
            <EmptyState message="לא נמצאו חבילות התואמות את החיפוש. נסו לשנות את התאריכים או התקציב." />
          ) : (
            <div className="flex flex-col gap-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} selected={compareIds.includes(pkg.id)} onToggleCompare={toggleCompare} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { AIRLINES } from "@travel-app/shared";

export interface FlightFilterState {
  maxPrice: number | null;
  maxStops: number | null;
  airlineCodes: string[];
}

export function FlightFilters({
  filters,
  onChange,
  priceBounds,
}: {
  filters: FlightFilterState;
  onChange: (f: FlightFilterState) => void;
  priceBounds: [number, number];
}) {
  return (
    <aside className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4 space-y-5 h-fit sticky top-20">
      <div>
        <h4 className="font-semibold text-brand-900 mb-2 text-sm">מחיר מקסימלי לנוסע</h4>
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={filters.maxPrice ?? priceBounds[1]}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
        <div className="text-xs text-brand-700/70 mt-1">עד ${filters.maxPrice ?? priceBounds[1]}</div>
      </div>

      <div>
        <h4 className="font-semibold text-brand-900 mb-2 text-sm">עצירות</h4>
        <div className="flex flex-col gap-1.5 text-sm">
          {[
            { label: "הכל", value: null },
            { label: "ישירה בלבד", value: 0 },
            { label: "עד עצירה אחת", value: 1 },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2">
              <input
                type="radio"
                name="stops"
                checked={filters.maxStops === opt.value}
                onChange={() => onChange({ ...filters, maxStops: opt.value })}
                className="accent-brand-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-brand-900 mb-2 text-sm">חברת תעופה</h4>
        <div className="flex flex-col gap-1.5 text-sm max-h-40 overflow-y-auto scrollbar-thin">
          {AIRLINES.map((a) => (
            <label key={a.code} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.airlineCodes.includes(a.code)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...filters.airlineCodes, a.code]
                    : filters.airlineCodes.filter((c) => c !== a.code);
                  onChange({ ...filters, airlineCodes: next });
                }}
                className="accent-brand-500"
              />
              {a.name}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

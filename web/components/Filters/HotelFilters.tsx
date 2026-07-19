"use client";

export interface HotelFilterState {
  minStarRating: number | null;
  maxPricePerNight: number | null;
}

export function HotelFilters({
  filters,
  onChange,
  priceBounds,
}: {
  filters: HotelFilterState;
  onChange: (f: HotelFilterState) => void;
  priceBounds: [number, number];
}) {
  return (
    <aside className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4 space-y-5 h-fit sticky top-20">
      <div>
        <h4 className="font-semibold text-brand-900 mb-2 text-sm">מחיר מקסימלי ללילה</h4>
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={filters.maxPricePerNight ?? priceBounds[1]}
          onChange={(e) => onChange({ ...filters, maxPricePerNight: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
        <div className="text-xs text-brand-700/70 mt-1">עד ${filters.maxPricePerNight ?? priceBounds[1]}</div>
      </div>

      <div>
        <h4 className="font-semibold text-brand-900 mb-2 text-sm">דירוג כוכבים מינימלי</h4>
        <div className="flex gap-1.5">
          {[null, 3, 4, 5].map((n) => (
            <button
              key={String(n)}
              type="button"
              onClick={() => onChange({ ...filters, minStarRating: n })}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                filters.minStarRating === n
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-brand-800 border-brand-100 hover:border-brand-300"
              }`}
            >
              {n ? `${n}+ ★` : "הכל"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

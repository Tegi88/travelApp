export function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-400 text-sm" aria-label={`${count} כוכבים`}>
      {"★".repeat(Math.round(count))}
      <span className="text-brand-100">{"★".repeat(5 - Math.round(count))}</span>
    </span>
  );
}

export function GuestRatingBadge({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const label = rating >= 9 ? "מעולה" : rating >= 8 ? "מצוין מאוד" : rating >= 7 ? "טוב מאוד" : "טוב";
  return (
    <div className="flex items-center gap-2">
      <span className="bg-brand-700 text-white text-sm font-bold rounded-lg px-2 py-1">{rating.toFixed(1)}</span>
      <div className="text-xs text-brand-800/70">
        <div className="font-medium text-brand-800">{label}</div>
        <div>{reviewCount.toLocaleString("he-IL")} ביקורות</div>
      </div>
    </div>
  );
}

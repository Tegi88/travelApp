export function SourceBadge({ source }: { source: "live" | "mock" }) {
  if (source === "live") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> נתונים חיים מה-API
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> נתוני הדגמה (Mock)
    </span>
  );
}

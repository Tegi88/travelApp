export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-brand-700/70">
      <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-center">{message}</div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-brand-50 border border-brand-100 text-brand-700 rounded-2xl p-8 text-center">
      {message}
    </div>
  );
}

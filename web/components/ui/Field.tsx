import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-brand-800 font-medium">{label}</span>
      {children}
    </label>
  );
}

const controlClass =
  "rounded-xl border border-brand-100 bg-white px-3 py-2 text-brand-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

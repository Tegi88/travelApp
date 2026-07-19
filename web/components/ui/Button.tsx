import { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-brand-200 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 transition-colors ${className ?? ""}`}
    />
  );
}

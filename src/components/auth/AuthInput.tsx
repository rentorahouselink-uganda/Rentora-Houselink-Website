import { ReactNode, InputHTMLAttributes } from "react";

type AuthInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  suffix?: ReactNode;
};

export function AuthInput({
  label,
  value,
  onChange,
  error,
  suffix,
  id,
  className,
  ...rest
}: AuthInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400",
            "transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
            suffix ? "pr-11" : "",
            error
              ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
              : "border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/25",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
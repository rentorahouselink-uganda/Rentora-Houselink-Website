"use client";

const CATEGORIES = [
  {
    value: "PROPERTY_CONDITION",
    label: "Property Condition",
    description: "Damage, maintenance or cleanliness",
    emoji: "🏗️",
  },
  {
    value: "CONTACT_CONDUCT",
    label: "Agent Conduct",
    description: "Agent or landlord behaviour",
    emoji: "👤",
  },
  {
    value: "PRICING",
    label: "Pricing Issue",
    description: "Incorrect or misleading price",
    emoji: "💸",
  },
  {
    value: "BOOKING",
    label: "Booking Issue",
    description: "Problem with a booking request",
    emoji: "📋",
  },
  {
    value: "APP_ISSUE",
    label: "App / Website Bug",
    description: "Technical problem with the platform",
    emoji: "🐛",
  },
  {
    value: "GENERAL",
    label: "General Feedback",
    description: "Suggestions or general feedback",
    emoji: "💬",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Something not listed above",
    emoji: "📝",
  },
] as const;

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export function CategoryGrid({ selected, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(cat.value)}
            className={[
              "flex items-start gap-3 rounded-xl border p-4 text-left transition",
              isSelected
                ? "border-emerald-600 bg-emerald-600 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            <span className="text-xl leading-none">{cat.emoji}</span>
            <div className="min-w-0 flex-1">
              <p
                className={[
                  "text-sm font-bold",
                  isSelected ? "text-white" : "text-slate-900",
                ].join(" ")}
              >
                {cat.label}
              </p>
              <p
                className={[
                  "mt-0.5 text-xs leading-snug",
                  isSelected ? "text-emerald-100" : "text-slate-500",
                ].join(" ")}
              >
                {cat.description}
              </p>
            </div>
            {isSelected && (
              <span className="shrink-0 text-sm font-bold text-white">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
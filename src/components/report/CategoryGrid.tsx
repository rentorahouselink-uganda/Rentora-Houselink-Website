"use client";

import {
  WrenchScrewdriverIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  BugAntIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const CATEGORIES = [
  { value: "PROPERTY_CONDITION", label: "Property Condition", description: "Damage, maintenance or cleanliness", Icon: WrenchScrewdriverIcon },
  { value: "CONTACT_CONDUCT", label: "Agent Conduct", description: "Agent or landlord behaviour", Icon: UserIcon },
  { value: "PRICING", label: "Pricing Issue", description: "Incorrect or misleading price", Icon: CurrencyDollarIcon },
  { value: "BOOKING", label: "Booking Issue", description: "Problem with a booking request", Icon: ClipboardDocumentCheckIcon },
  { value: "APP_ISSUE", label: "App / Website Bug", description: "Technical problem with the platform", Icon: BugAntIcon },
  { value: "GENERAL", label: "General Feedback", description: "Suggestions or general feedback", Icon: ChatBubbleBottomCenterTextIcon },
  { value: "OTHER", label: "Other", description: "Something not listed above", Icon: DocumentTextIcon },
] as const;

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export function CategoryGrid({ selected, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md sm:grid-cols-2 lg:grid-cols-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800">
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat.value;
        const { Icon } = cat;

        return (
          <button
            key={cat.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(cat.value)}
            className={[
              "group flex items-start gap-3 p-5 text-left transition-colors",
              isSelected
                ? "bg-emerald-50 dark:bg-emerald-950/30"
                : "bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            <Icon
              className={`mt-0.5 h-6 w-6 shrink-0 transition-colors ${
                isSelected
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              }`}
              strokeWidth={1.5}
            />
            <div className="min-w-0 flex-1">
              <p className={["text-sm font-bold", isSelected ? "text-emerald-900 dark:text-emerald-400" : "text-zinc-900 dark:text-white"].join(" ")}>
                {cat.label}
              </p>
              <p className={["mt-0.5 text-xs leading-snug", isSelected ? "text-emerald-700 dark:text-emerald-500" : "text-zinc-500 dark:text-zinc-400"].join(" ")}>
                {cat.description}
              </p>
            </div>
            {isSelected && (
              <span className="shrink-0 text-emerald-600 dark:text-emerald-500 text-xs font-bold">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
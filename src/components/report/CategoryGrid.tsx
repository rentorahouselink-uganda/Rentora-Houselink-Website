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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              "group flex items-start gap-3 rounded-xl p-4 text-left transition-all border",
              isSelected
                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-600",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            <div className={`mt-0.5 shrink-0 ${isSelected ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={["text-sm font-bold", isSelected ? "text-emerald-900 dark:text-emerald-400" : "text-slate-900 dark:text-white"].join(" ")}>
                {cat.label}
              </p>
              <p className={["mt-0.5 text-xs leading-snug", isSelected ? "text-emerald-700 dark:text-emerald-500" : "text-slate-500 dark:text-slate-400"].join(" ")}>
                {cat.description}
              </p>
            </div>
            <div className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? "border-emerald-600 bg-emerald-600" : "border-slate-300 dark:border-slate-700"}`}>
              {isSelected && <span className="text-[10px] font-bold text-white">✓</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
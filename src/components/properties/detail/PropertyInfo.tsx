import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  MapPinIcon,
  ShieldExclamationIcon,
  EyeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Property } from "@/types/property";
import { formatLabel, formatMoney } from "@/lib/utils";

export function PropertyInfo({ property }: { property: Property }) {
  const keyDetails = buildKeyDetails(property);
  const reportHref = `/report?propertyId=${property.id}&propertyTitle=${encodeURIComponent(property.title)}`;

  return (
    <div className="space-y-10">
      {/* ── Title / badges / location ── */}
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-emerald-600 dark:border-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
            <CheckCircleIcon className="h-3 w-3" />
            Verified
          </span>
          <span className="border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {formatLabel(property.type)}
          </span>
          {property.listingPurpose === "SALE" ? (
            <span className="bg-zinc-900 dark:bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white dark:text-zinc-950">
              For Sale
            </span>
          ) : (
            <span className="border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
              For Rent
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {property.title}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-base font-medium text-zinc-500 dark:text-zinc-400">
          <MapPinIcon className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
          {property.area?.name ? `${property.area.name}, ` : ""}
          {property.district.name}
        </p>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* ── Key details ── */}
      {keyDetails.length > 0 && (
        <div>
          <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
            Key Details
          </h2>
          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3">
            {keyDetails.map(({ label, value }) => (
              <DetailItem key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* ── Description ── */}
      <div>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
          About this property
        </h2>
        <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          {property.description || "No description provided."}
        </p>
      </div>

      {/* ── Amenities ── */}
      {property.amenities && property.amenities.length > 0 && (
        <>
          <hr className="border-zinc-200 dark:border-zinc-800" />
          <div>
            <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              Amenities
            </h2>
            <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-3">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" strokeWidth={1.5} />
                  <span className="text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* ── Engagement stats ── */}
      <div className="flex flex-wrap items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4" strokeWidth={1.5} />
          {(property.viewCount ?? 0).toLocaleString()} views
        </span>
        <span className="flex items-center gap-2">
          <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" strokeWidth={1.5} />
          {(property.enquiryCount ?? 0).toLocaleString()} enquiries
        </span>
        <span className="flex items-center gap-2">
          <CalendarDaysIcon className="h-4 w-4" strokeWidth={1.5} />
          Listed{" "}
          {new Date(property.createdAt).toLocaleDateString("en-UG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* ── Report link ── */}
      <div className="pt-2">
        <Link
          href={reportHref}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 transition-colors"
        >
          <ShieldExclamationIcon className="h-4 w-4" strokeWidth={1.5} />
          Report an issue with this property
        </Link>
      </div>
    </div>
  );
}

// ── Detail Item ──
function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p className="text-base font-semibold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

type DetailItem = { label: string; value: ReactNode };

function buildKeyDetails(property: Property): DetailItem[] {
  const items: DetailItem[] = [];

  if (property.numberOfRooms) items.push({ label: "Rooms", value: property.numberOfRooms });
  items.push({ label: "Parking", value: property.parkingAvailable ? "Available" : "None" });
  items.push({
    label: "Status",
    value: (
      <span className={property.status === "AVAILABLE" ? "text-emerald-600 dark:text-emerald-500" : ""}>
        {property.status === "AVAILABLE" ? "Available Now" : formatLabel(property.status)}
      </span>
    ),
  });

  if (property.furnishingStatus) items.push({ label: "Furnishing", value: formatLabel(property.furnishingStatus) });
  if (property.floor != null) items.push({ label: "Floor", value: `Floor ${property.floor}` });
  if (property.totalRooms) items.push({ label: "Total Rooms", value: property.totalRooms });
  if (property.hotelCategory) items.push({ label: "Category", value: formatLabel(property.hotelCategory) });
  if (property.securityDeposit) items.push({ label: "Security Deposit", value: formatMoney(property.securityDeposit) });

  if (property.availableFrom) {
    items.push({
      label: "Available From",
      value: new Date(property.availableFrom).toLocaleDateString("en-UG", {
        day: "numeric", month: "short", year: "numeric",
      }),
    });
  }
  return items;
}
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
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircleIcon className="h-4 w-4" />
            Verified
          </span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {formatLabel(property.type)}
          </span>
          {property.listingPurpose === "SALE" ? (
            <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-400">
              For Sale
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-400">
              For Rent
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl">
          {property.title}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-400">
          <MapPinIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
          {property.area?.name ? `${property.area.name}, ` : ""}
          {property.district.name}
        </p>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── Key details list (Borderless) ── */}
      {keyDetails.length > 0 && (
        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            Key Details
          </h2>
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3">
            {keyDetails.map(({ label, value }) => (
              <DetailItem key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── Description ── */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          About this property
        </h2>
        <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {property.description || "No description provided."}
        </p>
      </div>

      {/* ── Amenities ── */}
      {property.amenities && property.amenities.length > 0 && (
        <>
          <hr className="border-slate-200 dark:border-slate-800" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Amenities</h2>
            <div className="mt-6 grid grid-cols-2 gap-y-4 sm:grid-cols-3">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <span className="text-base font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── Engagement stats ── */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5" />
          {(property.viewCount ?? 0).toLocaleString()} views
        </span>
        <span className="flex items-center gap-2">
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          {(property.enquiryCount ?? 0).toLocaleString()} enquiries
        </span>
        <span className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5" />
          Listed{" "}
          {new Date(property.createdAt).toLocaleDateString("en-UG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* ── Report link ── */}
      <div className="pt-4">
        <Link
          href={reportHref}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
        >
          <ShieldExclamationIcon className="h-5 w-5" />
          Report an issue with this property
        </Link>
      </div>
    </div>
  );
}

// ── Borderless Detail Item ──
function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900 dark:text-white">
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
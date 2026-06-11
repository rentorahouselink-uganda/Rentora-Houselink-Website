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

  // Build the report URL with property context pre-filled
  const reportHref = `/report?propertyId=${property.id}&propertyTitle=${encodeURIComponent(property.title)}`;

  return (
    <div className="space-y-8">
      {/* ── Title / badges / location ─────────────────────────────────── */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <CheckCircleIcon className="h-4 w-4" />
            Verified
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {formatLabel(property.type)}
          </span>
          {property.listingPurpose === "SALE" ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              For Sale
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
              For Rent
            </span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
          {property.title}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-base text-slate-600">
          <MapPinIcon className="h-5 w-5 shrink-0 text-slate-400" />
          {property.area?.name ? `${property.area.name}, ` : ""}
          {property.district.name}
        </p>
      </div>

      {/* ── Key details grid ──────────────────────────────────────────── */}
      {keyDetails.length > 0 && (
        <>
          <hr className="border-slate-200" />
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Key Details
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {keyDetails.map(({ label, value }) => (
                <DetailCell key={label} label={label} value={value} />
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="border-slate-200" />

      {/* ── Description ──────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          About this property
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
          {property.description || "No description provided."}
        </p>
      </div>

      {/* ── Amenities ────────────────────────────────────────────────── */}
      {property.amenities && property.amenities.length > 0 && (
        <>
          <hr className="border-slate-200" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-slate-700"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Engagement stats ─────────────────────────────────────────── */}
      <hr className="border-slate-200" />
      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <EyeIcon className="h-4 w-4" />
          {(property.viewCount ?? 0).toLocaleString()} views
        </span>
        <span className="flex items-center gap-1.5">
          <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
          {(property.enquiryCount ?? 0).toLocaleString()} enquiries
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDaysIcon className="h-4 w-4" />
          Listed{" "}
          {new Date(property.createdAt).toLocaleDateString("en-UG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* ── Report link ──────────────────────────────────────────────── */}
      <div>
        <Link
          href={reportHref}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 underline underline-offset-4 transition-colors hover:text-rose-500"
        >
          <ShieldExclamationIcon className="h-4 w-4" />
          Report an issue with this property
        </Link>
      </div>
    </div>
  );
}

// ── Detail cell ───────────────────────────────────────────────────────────────

function DetailCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

// ── Build key details list ────────────────────────────────────────────────────

type DetailItem = { label: string; value: ReactNode };

function buildKeyDetails(property: Property): DetailItem[] {
  const items: DetailItem[] = [];

  if (property.numberOfRooms) {
    items.push({ label: "Rooms", value: property.numberOfRooms });
  }

  items.push({
    label: "Parking",
    value: property.parkingAvailable ? "Available" : "None",
  });

  items.push({
    label: "Status",
    value: (
      <span
        className={
          property.status === "AVAILABLE" ? "text-emerald-600" : undefined
        }
      >
        {property.status === "AVAILABLE"
          ? "Available Now"
          : formatLabel(property.status)}
      </span>
    ),
  });

  if (property.furnishingStatus) {
    items.push({
      label: "Furnishing",
      value: formatLabel(property.furnishingStatus),
    });
  }

  if (property.floor != null) {
    items.push({ label: "Floor", value: `Floor ${property.floor}` });
  }

  if (property.totalRooms) {
    items.push({ label: "Total Rooms", value: property.totalRooms });
  }

  if (property.hotelCategory) {
    items.push({
      label: "Category",
      value: formatLabel(property.hotelCategory),
    });
  }

  if (property.securityDeposit) {
    items.push({
      label: "Security Deposit",
      value: formatMoney(property.securityDeposit),
    });
  }

  if (property.availableFrom) {
    items.push({
      label: "Available From",
      value: new Date(property.availableFrom).toLocaleDateString("en-UG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
  }

  return items;
}
import { Property } from "@/types/property";

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLabel(value?: string | null) {
  if (!value) return "";
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
}

export function formatBillingCycle(value?: string | null) {
  if (!value) return "";
  return `/${formatLabel(value)}`;
}

export function getPropertyLocation(property: Property) {
  return [property.area?.name, property.district?.name].filter(Boolean).join(", ");
}

export function getPropertyImage(property: Property) {
  const primary = property.images?.find((image) => image.isPrimary);
  return primary?.url ?? property.images?.[0]?.url ?? property.videos?.[0]?.thumbnailUrl ?? null;
}
import type { Metadata } from "next";
import { ReportPage } from "@/components/report/ReportPage";

export const metadata: Metadata = {
  title: "Report an Issue – Rentora Houselink",
  description:
    "Submit a complaint or report an issue with a property or the platform.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getString(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ReportRoute({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <ReportPage
      propertyId={getString(params, "propertyId")}
      propertyTitle={getString(params, "propertyTitle")}
    />
  );
}
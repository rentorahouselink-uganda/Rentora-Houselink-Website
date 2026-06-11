import { Property } from "@/types/property";
import { DetailNavbar } from "./DetailNavbar";
import { MediaViewer } from "./MediaViewer";
import { PropertyInfo } from "./PropertyInfo";
import { StickyActionCard } from "./StickyActionCard";
import { MobileActionBox } from "./MobileActionBox";
import { PropertyVideosSection } from "./PropertyVideosSection";
import { SimilarProperties } from "./SimilarProperties";

export function PropertyDetailView({ property }: { property: Property }) {
  // Videos section only appears when the property has BOTH images and videos,
  // so we don't duplicate content already shown in the hero carousel.
  const showVideosSection =
    property.images.length > 0 && property.videos.length > 0;

  return (
    <main className="min-h-screen bg-slate-50 pb-32 lg:pb-16">
      <DetailNavbar />

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Primary grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">

          {/* Left column: media → info → videos */}
          <div className="space-y-6 lg:col-span-8">
            <MediaViewer property={property} />

            {/* Info wrapped in a card to lift it off the slate background */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <PropertyInfo property={property} />
            </div>

            {showVideosSection && (
              <PropertyVideosSection videos={property.videos} />
            )}
          </div>

          {/* Right column: sticky pricing + actions (desktop only) */}
          <div className="hidden lg:col-span-4 lg:block">
            <StickyActionCard property={property} />
          </div>

        </div>

        {/* ── Similar properties — full width below the grid ─────── */}
        <div className="mt-16 mb-8">
          <SimilarProperties property={property} />
        </div>
      </div>

      {/* Mobile sticky bottom action bar */}
      <MobileActionBox property={property} />
    </main>
  );
}
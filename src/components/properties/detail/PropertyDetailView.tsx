import { FavoritesProvider } from "@/components/properties/favorites-context";
import { Property } from "@/types/property";
import { DetailNavbar } from "./DetailNavbar";
import { MediaViewer } from "./MediaViewer";
import { PropertyInfo } from "./PropertyInfo";
import { StickyActionCard } from "./StickyActionCard";
import { MobileActionBox } from "./MobileActionBox";
import { PropertyVideosSection } from "./PropertyVideosSection";
import { SimilarProperties } from "./SimilarProperties";

export function PropertyDetailView({ property }: { property: Property }) {
  const showVideosSection =
    property.images.length > 0 && property.videos.length > 0;

  return (
    <FavoritesProvider>
      <main className="min-h-screen bg-white dark:bg-slate-950 pb-32 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          {/* Seamless Breadcrumb Nav */}
          <DetailNavbar propertyId={property.id} />

          {/* Cinematic Full-Width Media Hero */}
          <div className="mt-6 mb-10">
            <MediaViewer property={property} />
          </div>

          {/* ── Primary grid ── */}
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* Left column: Info & Videos (Unboxed, flat design) */}
            <div className="space-y-12 lg:col-span-8">
              <PropertyInfo property={property} />

              {showVideosSection && (
                <PropertyVideosSection videos={property.videos} />
              )}
            </div>

            {/* Right column: Sticky booking action */}
            <div className="hidden lg:col-span-4 lg:block">
              <StickyActionCard property={property} />
            </div>
          </div>

          <hr className="my-16 border-slate-200 dark:border-slate-800" />

          <div className="mb-8">
            <SimilarProperties property={property} />
          </div>
        </div>

        <MobileActionBox property={property} />
      </main>
    </FavoritesProvider>
  );
}
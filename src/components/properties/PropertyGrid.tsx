import { Property } from "@/hooks/useProperties";
import { PropertyCard } from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  view?: "grid" | "list";
  savedIds?: string[];
  onSaveToggle?: (id: string, currently: boolean) => void;
  className?: string;
}

function PropertySkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex gap-4 bg-card border border-border rounded-lg overflow-hidden shadow-card p-4">
        <Skeleton className="w-48 h-36 rounded-md shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

function PropertyListCard({
  property,
  saved,
  onSaveToggle,
}: {
  property: Property;
  saved?: boolean;
  onSaveToggle?: (id: string, currently: boolean) => void;
}) {
  const img =
    property.featured_image ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

  return (
    <div className="flex gap-4 bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-luxe transition-all duration-300 group">
      <a href={`/listings/${property.id}`} className="relative w-44 sm:w-56 shrink-0 overflow-hidden">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded bg-primary text-primary-foreground capitalize">
          {property.deal_type === "sale" ? "For Sale" : property.deal_type === "rent" ? "For Rent" : "Lease"}
        </span>
      </a>
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <a href={`/listings/${property.id}`}>
              <h3 className="font-serif text-lg text-primary hover:text-gold transition-colors leading-tight line-clamp-2">
                {property.title}
              </h3>
            </a>
            {onSaveToggle && (
              <button
                onClick={() => onSaveToggle(property.id, !!saved)}
                className="shrink-0 p-1 text-muted-foreground hover:text-gold"
                aria-label={saved ? "Unsave" : "Save"}
              >
                {saved ? "♥" : "♡"}
              </button>
            )}
          </div>
          {property.neighborhood && (
            <p className="text-xs text-muted-foreground mb-2">{property.neighborhood}</p>
          )}
          {property.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <span className="font-serif text-xl text-primary font-semibold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(property.price)}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {property.bedrooms != null && <span>{property.bedrooms} beds</span>}
            {property.bathrooms != null && <span>{property.bathrooms} baths</span>}
            {property.size_sqm != null && <span>{property.size_sqm.toLocaleString()} m²</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyGrid({
  properties,
  loading = false,
  view = "grid",
  savedIds = [],
  onSaveToggle,
  className,
}: PropertyGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col gap-4",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertySkeleton key={i} view={view} />
        ))}
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {properties.map((p) => (
          <PropertyListCard
            key={p.id}
            property={p}
            saved={savedIds.includes(p.id)}
            onSaveToggle={onSaveToggle}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
        className
      )}
    >
      {properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          saved={savedIds.includes(p.id)}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  );
}

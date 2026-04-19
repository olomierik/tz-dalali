import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Maximize2, MapPin, BadgeCheck, Heart } from "lucide-react";
import { Property } from "@/hooks/useProperties";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  saved?: boolean;
  onSaveToggle?: (id: string, currently: boolean) => void;
  className?: string;
}

const dealTypeLabel: Record<string, string> = {
  sale: "For Sale",
  rent: "For Rent",
  lease: "Lease",
};

const dealTypeClass: Record<string, string> = {
  sale: "bg-primary text-primary-foreground",
  rent: "bg-gold text-gold-foreground",
  lease: "bg-secondary text-secondary-foreground border border-border",
};

function formatPrice(price: number, currency: string, dealType: string, rentPeriod?: string | null): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "USD",
    maximumFractionDigits: 0,
  }).format(price);
  if (dealType === "rent" && rentPeriod) {
    return `${formatted} / ${rentPeriod}`;
  }
  return formatted;
}

const FALLBACK =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export function PropertyCard({ property, saved = false, onSaveToggle, className }: PropertyCardProps) {
  const img = property.featured_image || FALLBACK;

  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-luxe hover:-translate-y-1 transition-all duration-500",
        className
      )}
    >
      {/* Image */}
      <Link to={`/listings/${property.id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Deal type badge */}
        <span
          className={cn(
            "absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded",
            dealTypeClass[property.deal_type] ?? "bg-secondary text-secondary-foreground"
          )}
        >
          {dealTypeLabel[property.deal_type] ?? property.deal_type}
        </span>

        {/* Featured badge */}
        {property.is_featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded bg-gold text-gold-foreground">
            Featured
          </span>
        )}
      </Link>

      {/* Save button */}
      {onSaveToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onSaveToggle(property.id, saved);
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart
            className={cn("h-4 w-4", saved ? "fill-gold text-gold" : "text-muted-foreground")}
          />
        </button>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif text-xl text-primary font-semibold">
            {formatPrice(property.price, property.price_currency, property.deal_type, property.rent_period)}
          </span>
          {property.price_negotiable && (
            <span className="text-xs text-gold border border-gold/40 px-1.5 py-0.5 rounded">
              Negotiable
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/listings/${property.id}`}>
          <h3 className="font-serif text-lg text-primary leading-snug mb-1 hover:text-gold transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        {property.neighborhood && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{property.neighborhood}</span>
          </p>
        )}

        {/* Key stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          )}
          {property.size_sqm != null && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {property.size_sqm.toLocaleString()} m²
            </span>
          )}
          <span className="ml-auto text-xs capitalize text-muted-foreground/80">
            {property.property_type}
          </span>
        </div>
      </div>
    </div>
  );
}

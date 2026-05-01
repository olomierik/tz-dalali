import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Maximize2, MapPin, BadgeCheck, Heart, GitCompare } from "lucide-react";
import { Property } from "@/hooks/useProperties";
import { cn } from "@/lib/utils";
import { useComparison } from "@/contexts/ComparisonContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  saved?: boolean;
  onSaveToggle?: (id: string, currently: boolean) => void;
  className?: string;
  showCompare?: boolean;
}

const dealTypeLabel: Record<string, string> = {
  sale: "For Sale",
  rent: "For Rent",
  lease: "Lease",
};

const dealTypeClass: Record<string, string> = {
  sale: "bg-booking-blue text-white",
  rent: "bg-booking-yellow text-booking-blue",
  lease: "bg-gray-100 text-gray-700 border border-gray-300",
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

export function PropertyCard({ property, saved = false, onSaveToggle, className, showCompare = true }: PropertyCardProps) {
  const img = property.featured_image || FALLBACK;
  const { addProperty, removeProperty, isInComparison, properties } = useComparison();
  const [isAdding, setIsAdding] = useState(false);
  const inComparison = isInComparison(property.id);
  const canAddMore = properties.length < 4;

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    if (inComparison) {
      removeProperty(property.id);
    } else if (canAddMore) {
      addProperty(property);
    }
    
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div
      className={cn(
        "group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-booking-hover hover:-translate-y-0.5",
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Deal type badge */}
        <span
          className={cn(
            "absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded",
            dealTypeClass[property.deal_type] ?? "bg-gray-100 text-gray-700"
          )}
        >
          {dealTypeLabel[property.deal_type] ?? property.deal_type}
        </span>

        {/* Featured badge */}
        {property.is_featured && (
          <span className="absolute top-3 right-14 text-xs font-semibold px-2 py-1 rounded bg-booking-yellow text-booking-blue">
            Featured
          </span>
        )}

        {/* Verified badge */}
        {property.is_verified && (
          <span className="absolute bottom-3 left-3 text-xs font-medium px-2 py-1 rounded bg-white/90 text-booking-blue flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        )}
      </Link>

      {/* Compare button */}
      {showCompare && (
        <button
          onClick={handleCompareToggle}
          className={cn(
            "absolute top-3 right-3 z-10 p-1.5 rounded-full shadow-sm transition-all duration-200",
            inComparison
              ? "bg-booking-blue text-white hover:bg-booking-blue-light"
              : canAddMore
              ? "bg-white/90 hover:bg-white text-gray-600 hover:text-booking-blue"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
          aria-label={inComparison ? "Remove from comparison" : "Add to comparison"}
          disabled={!canAddMore && !inComparison}
        >
          {inComparison ? (
            <Check className="h-4 w-4" />
          ) : (
            <GitCompare className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Save button */}
      {onSaveToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onSaveToggle(property.id, saved);
          }}
          className="absolute top-12 right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart
            className={cn("h-4 w-4", saved ? "fill-booking-yellow text-booking-yellow" : "text-gray-600")}
          />
        </button>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif text-xl font-semibold text-booking-blue">
            {formatPrice(property.price, property.price_currency, property.deal_type, property.rent_period)}
          </span>
          {property.price_negotiable && (
            <span className="text-xs text-booking-yellow border border-booking-yellow/40 px-1.5 py-0.5 rounded font-medium">
              Negotiable
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/listings/${property.id}`}>
          <h3 className="font-serif text-lg text-gray-900 leading-snug mb-1 hover:text-booking-blue transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        {property.neighborhood && (
          <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{property.neighborhood}</span>
          </p>
        )}

        {/* Key stats */}
        <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-gray-400" />
              {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-gray-400" />
              {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          )}
          {property.size_sqm != null && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
              {property.size_sqm.toLocaleString()} m²
            </span>
          )}
          <span className="ml-auto text-xs capitalize text-gray-400">
            {property.property_type}
          </span>
        </div>
      </div>
    </div>
  );
}
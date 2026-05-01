import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import Link from "next/link";

export function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/real-estate/${property._id}`} className="group block bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 right-2">
          <Badge className="bg-[#003580]">{property.type}</Badge>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{property.title}</h3>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="h-3 w-3 mr-1" />
          {property.location}
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mb-4 border-t pt-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {property.bedrooms}
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms}
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" /> {property.area} m²
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#003580]">{property.currency} {property.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">Available</span>
        </div>
      </div>
    </Link>
  );
}

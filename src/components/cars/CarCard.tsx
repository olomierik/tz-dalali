import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Car as CarIcon, Calendar, Gauge, MapPin, BadgeCheck, Heart } from "lucide-react";
import { Car } from "@/hooks/useCars";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: Car;
  saved?: boolean;
  onSaveToggle?: (id: string, currently: boolean) => void;
  className?: string;
}

export function CarCard({ car, saved = false, onSaveToggle, className }: CarCardProps) {
  const { t } = useLanguage();
  const img = car.featured_image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80";

  return (
    <div
      className={cn(
        "group relative bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <Link to={`/cars/${car.id}`} className="block relative overflow-hidden aspect-[16/10]">
        <img
          src={img}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-black/50 backdrop-blur-md text-gold border-gold/50">
            {car.condition === 'new' ? 'New' : 'Used'}
          </Badge>
          {car.is_featured && (
            <Badge className="bg-gold text-black border-none">
              Featured
            </Badge>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-gold/20">
          <span className="text-lg font-bold text-black">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: car.price_currency || "USD",
              maximumFractionDigits: 0,
            }).format(car.price)}
          </span>
        </div>
      </Link>

      {/* Save button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onSaveToggle?.(car.id, saved);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm transition-all"
      >
        <Heart
          className={cn("h-5 w-5", saved ? "fill-red-500 text-red-500" : "text-gray-600")}
        />
      </button>

      {/* Content */}
      <div className="p-5">
        <Link to={`/cars/${car.id}`}>
          <h3 className="font-serif text-xl font-bold text-black mb-1 group-hover:text-gold transition-colors">
            {car.make} {car.model}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar className="h-3 w-3 text-gold" />
          <span>{car.year}</span>
          <span className="text-gray-300">•</span>
          <Gauge className="h-3 w-3 text-gold" />
          <span>{car.mileage?.toLocaleString()} {car.mileage_unit}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 rounded-md">
              <CarIcon className="h-4 w-4 text-gold" />
            </div>
            <span className="text-xs font-medium text-gray-700 capitalize">{car.body_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 rounded-md">
              <BadgeCheck className="h-4 w-4 text-gold" />
            </div>
            <span className="text-xs font-medium text-gray-700 capitalize">{car.transmission}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
